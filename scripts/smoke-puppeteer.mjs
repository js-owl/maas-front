/**
 * Fail fast in Docker builder if Chromium + puppeteer-core cannot launch.
 */
import { execFileSync } from 'node:child_process'
import { accessSync, constants } from 'node:fs'
import puppeteer from 'puppeteer-core'

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
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
      console.log(`[smoke-puppeteer] using chromium: ${resolved}`)
      return resolved
    } catch {
      // try next candidate
    }
  }

  throw new Error('Chromium not found for smoke test')
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

async function gotoAboutBlank(page) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto('about:blank', { waitUntil: 'domcontentloaded', timeout: 15_000 })
      return
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
  throw lastError
}

const executablePath = resolveChromiumExecutable()
const browser = await puppeteer.launch({
  headless: true,
  executablePath,
  timeout: 60_000,
  args: LAUNCH_ARGS,
})

try {
  await waitForBrowserReady(browser)
  const page = await browser.newPage()
  await gotoAboutBlank(page)
  console.log('[smoke-puppeteer] browser launch OK')
} finally {
  await browser.close()
}
