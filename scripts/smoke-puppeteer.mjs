/**
 * Fail fast in Docker builder if Chromium + puppeteer-core cannot launch.
 */
import { execFileSync } from 'node:child_process'
import { accessSync, constants } from 'node:fs'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const LAUNCH_ARGS = [
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
]

function resolveSymlink(candidate) {
  if (process.platform === 'win32') {
    return candidate
  }
  try {
    return execFileSync('readlink', ['-f', candidate], { encoding: 'utf8' }).trim() || candidate
  } catch {
    return candidate
  }
}

function chromiumCandidates() {
  const localAppData = process.env.LOCALAPPDATA || ''
  const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files'
  const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)'

  return [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/lib/chromium/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    join(programFiles, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(programFilesX86, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(localAppData, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    join(programFiles, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    join(programFilesX86, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean)
}

function resolveChromiumExecutable() {
  for (const candidate of chromiumCandidates()) {
    try {
      const resolved = resolveSymlink(candidate)
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
