/**
 * Post-build prerender: snapshot indexable SPA routes to static HTML in dist/.
 */
import { spawn, execFileSync } from 'node:child_process'
import { accessSync, constants, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const VITE_BIN = join(ROOT, 'node_modules/vite/bin/vite.js')
const PORT = Number(process.env.PRERENDER_PORT || 4173)
const PREVIEW_HOST = process.env.PRERENDER_HOST || '127.0.0.1'
const PREVIEW_URL = `http://${PREVIEW_HOST}:${PORT}`
const ROUTE_TIMEOUT_MS = Number(process.env.PRERENDER_ROUTE_TIMEOUT_MS || 20_000)
const PRERENDER_CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY || 1)
const VIEWPORT = {
  width: Number(process.env.PRERENDER_VIEWPORT_WIDTH || 1280),
  height: Number(process.env.PRERENDER_VIEWPORT_HEIGHT || 800),
}

const BLOCKED_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'mc.yandex.ru',
  'yandex.ru/metrika',
]

const catalog = JSON.parse(
  readFileSync(join(ROOT, 'src/seo/public-routes.json'), 'utf8'),
)

const indexablePaths = catalog.routes
  .filter((route) => route.indexable !== false && !route.robots?.includes('noindex'))
  .map((route) => route.path)

const titleByPath = new Map(
  catalog.routes.map((route) => [route.path, route.title]),
)

function logTiming(label, startedAt) {
  console.log(`[prerender] ${label}: ${Math.round(performance.now() - startedAt)}ms`)
}

const SINGLE_PROCESS = process.env.PRERENDER_SINGLE_PROCESS === '1'

const CHROMIUM_LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--disable-software-rasterizer',
  '--no-first-run',
  ...(SINGLE_PROCESS ? ['--no-zygote', '--single-process'] : []),
]

function resolveChromiumExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/lib/chromium/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      const resolved = execFileSync('readlink', ['-f', candidate], { encoding: 'utf8' }).trim()
      if (!resolved) {
        continue
      }
      accessSync(resolved, constants.X_OK)
      console.log(`[prerender] using chromium: ${resolved}`)
      return resolved
    } catch {
      // try next candidate
    }
  }

  throw new Error(
    'Chromium not found for prerender. Install chromium in the builder image or set PUPPETEER_EXECUTABLE_PATH.',
  )
}

async function waitForBrowserReady(browser) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await browser.version()
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }
  throw new Error('Chromium did not become ready after launch')
}

async function launchBrowser() {
  const executablePath = resolveChromiumExecutable()
  const maxAttempts = Number(process.env.PUPPETEER_LAUNCH_ATTEMPTS || 3)
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let browser
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath,
        timeout: Number(process.env.PUPPETEER_LAUNCH_TIMEOUT_MS || 120_000),
        protocolTimeout: Number(process.env.PUPPETEER_PROTOCOL_TIMEOUT_MS || 120_000),
        dumpio: process.env.PRERENDER_DEBUG === '1',
        args: CHROMIUM_LAUNCH_ARGS,
      })
      browser.on('disconnected', () => {
        console.error('[prerender] browser disconnected unexpectedly')
      })
      await waitForBrowserReady(browser)
      return browser
    } catch (error) {
      lastError = error
      if (browser) {
        await browser.close().catch(() => {})
      }
      console.error(`[prerender] browser launch attempt ${attempt}/${maxAttempts} failed:`, error)
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  throw lastError
}

async function createConfiguredPage(browser) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const page = await browser.newPage()
      await configurePage(page)
      return page
    } catch (error) {
      lastError = error
      console.error(`[prerender] newPage attempt ${attempt}/3 failed:`, error)
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
  throw lastError
}

function outputFileForPath(routePath) {
  if (routePath === '/') {
    return join(DIST, 'index.html')
  }
  const dir = join(DIST, routePath.slice(1))
  mkdirSync(dir, { recursive: true })
  return join(dir, 'index.html')
}

function startPreview() {
  const child = spawn(
    process.execPath,
    [VITE_BIN, 'preview', '--port', String(PORT), '--strictPort', '--host', PREVIEW_HOST],
    {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, BROWSER: 'none' },
    },
  )

  child.stdout?.on('data', (chunk) => process.stdout.write(chunk))
  child.stderr?.on('data', (chunk) => process.stderr.write(chunk))

  return child
}

async function stopPreview(preview) {
  if (!preview || preview.killed || preview.exitCode !== null) {
    return
  }

  preview.stdout?.destroy()
  preview.stderr?.destroy()

  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (preview.pid) {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'], {
            shell: true,
            stdio: 'ignore',
          }).on('close', resolve)
          return
        }
        try {
          preview.kill('SIGKILL')
        } catch {
          // already gone
        }
      }
      resolve()
    }, 2_000)

    preview.once('close', () => {
      clearTimeout(timer)
      resolve()
    })

    try {
      preview.kill('SIGTERM')
    } catch {
      clearTimeout(timer)
      resolve()
    }
  })
}

async function waitForPreview(timeoutMs = 60_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${PREVIEW_URL}/`)
      if (response.ok) {
        return
      }
    } catch {
      // preview still starting
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`Preview server did not start on ${PREVIEW_URL}`)
}

function shouldBlockRequest(url) {
  if (url.includes('/api/v3') || url.includes('/api/')) {
    return true
  }
  return BLOCKED_HOSTS.some((host) => url.includes(host))
}

async function configurePage(page) {
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    if (shouldBlockRequest(request.url())) {
      request.abort()
      return
    }
    request.continue()
  })

  await page.evaluateOnNewDocument(() => {
    try {
      localStorage.setItem('analytics_consent', 'false')
      // Skip coefficients API during prerender (requests are blocked below).
      localStorage.setItem(
        'coefficients:allCoefficients',
        JSON.stringify({
          finish: [{ value: 'prerender', label: 'prerender' }],
          cover: [],
          tolerance: [],
        }),
      )
    } catch {
      // ignore
    }
  })
}

async function snapshotPageHtml(page) {
  await page.evaluate(() => {
    document
      .querySelectorAll('.el-message, .el-message-box, .el-notification, .el-overlay')
      .forEach((el) => el.remove())
  })
  return page.content()
}

async function prerenderRoute(page, routePath) {
  const expectedTitle = titleByPath.get(routePath)
  const url = routePath === '/' ? `${PREVIEW_URL}/` : `${PREVIEW_URL}${routePath}`
  const routeStarted = performance.now()

  await page.setViewport(VIEWPORT)
  await page.goto(url, { waitUntil: 'load', timeout: ROUTE_TIMEOUT_MS })

  try {
    await page.waitForFunction(
      (title) => {
        const app = document.querySelector('#app')
        return Boolean(app?.textContent?.trim()) && document.title === title
      },
      { timeout: ROUTE_TIMEOUT_MS, polling: 100 },
      expectedTitle,
    )
  } catch (error) {
    const actualTitle = await page.title()
    const hasAppContent = await page.evaluate(() => {
      const app = document.querySelector('#app')
      return Boolean(app?.textContent?.trim())
    })
    throw new Error(
      `Route not ready (title: "${actualTitle}", expected: "${expectedTitle}", appContent: ${hasAppContent})`,
      { cause: error },
    )
  }

  const html = await snapshotPageHtml(page)
  const outFile = outputFileForPath(routePath)
  writeFileSync(outFile, html, 'utf8')
  logTiming(routePath, routeStarted)
}

async function prerenderRoutesParallel(browser, routePaths) {
  const failures = []
  let nextIndex = 0

  async function worker() {
    const page = await createConfiguredPage(browser)

    try {
      while (true) {
        const index = nextIndex
        nextIndex += 1
        if (index >= routePaths.length) {
          break
        }

        const routePath = routePaths[index]
        try {
          await prerenderRoute(page, routePath)
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          failures.push({ path: routePath, message })
          console.error(`Failed ${routePath}: ${message}`)
        }
      }
    } finally {
      await page.close()
    }
  }

  const workers = Array.from(
    { length: Math.min(PRERENDER_CONCURRENCY, routePaths.length) },
    () => worker(),
  )
  await Promise.all(workers)

  return failures
}

async function main() {
  const totalStarted = performance.now()
  const preview = startPreview()
  let browser

  try {
    const previewStarted = performance.now()
    await waitForPreview()
    logTiming('preview server ready', previewStarted)

    const browserStarted = performance.now()
    browser = await launchBrowser()
    logTiming('browser launch', browserStarted)

    const failures = await prerenderRoutesParallel(browser, indexablePaths)

    if (failures.length > 0) {
      console.error(`Prerender failed for ${failures.length} route(s)`)
      process.exitCode = 1
      return
    }

    logTiming(`complete (${indexablePaths.length} routes)`, totalStarted)
  } finally {
    if (browser) {
      await browser.close()
    }
    await stopPreview(preview)
  }
}

main()
  .then(() => {
    // Force exit: preview/chromium can leave handles open in Docker/Linux.
    process.exit(process.exitCode ?? 0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
