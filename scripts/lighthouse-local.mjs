/**
 * Run Lighthouse against vite preview (or any base URL) for a list of routes.
 *
 * Usage (from repo root, with `npx vite preview --port 4173` running):
 *   node scripts/lighthouse-local.mjs
 *   node scripts/lighthouse-local.mjs --mobile
 *   LH_BASE=http://127.0.0.1:4173 node scripts/lighthouse-local.mjs
 *
 * JSON reports go to .lighthouse-results/ (gitignored).
 */
import { execSync } from 'child_process'
import { mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT = join(ROOT, '.lighthouse-results')

/** Public routes (edit to add/remove). Nested routes like /personal/profile need auth for full UI. */
const ROUTES = [
  '/',
  '/mechanical',
  '/print',
  '/pkm',
  '/painting',
  '/test',
  '/galv',
  '/weld',
  '/rubber',
  '/testing',
  '/other',
  '/other2',
  '/machining2',
  '/milling',
  '/milling2',
  '/printing',
  '/license',
  '/offer-client',
  '/policy',
]

const BASE = (process.env.LH_BASE || 'http://127.0.0.1:4173').replace(/\/$/, '')
const mobile = process.argv.includes('--mobile')

mkdirSync(OUT, { recursive: true })

function slug(path) {
  if (path === '/') return 'home'
  return path.replace(/^\//, '').replace(/\//g, '_')
}

function runOne(routePath) {
  const url = routePath === '/' ? BASE : `${BASE}${routePath}`
  const mode = mobile ? 'mobile' : 'desktop'
  const file = join(OUT, `lh-${mode}-${slug(routePath)}.json`)
  const chrome =
    '--chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"'
  let cmd = `npx lighthouse "${url}" --only-categories=performance,best-practices --output=json --output-path="${file}" --quiet ${chrome}`
  if (mobile) {
    cmd += ` --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate`
  } else {
    cmd += ` --preset=desktop`
  }
  console.log(`\n>>> ${mode} ${routePath}`)
  execSync(cmd, { cwd: ROOT, stdio: 'inherit', shell: true })
}

for (const route of ROUTES) {
  runOne(route)
}

console.log(`\nDone. Reports in ${OUT}`)
