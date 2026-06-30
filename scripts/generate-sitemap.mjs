/**
 * Generates public/sitemap.xml and public/llms.txt from src/seo/public-routes.json.
 */
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const catalogPath = join(ROOT, 'src/seo/public-routes.json')
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'))

const origin = catalog.siteOrigin.replace(/\/$/, '')
const today = new Date().toISOString().slice(0, 10)

const indexable = catalog.routes.filter(
  (route) => route.indexable !== false && !route.robots?.includes('noindex'),
)

const OPTIONAL_PATHS = new Set(['/license', '/offer-client', '/policy'])

const primaryRoutes = indexable.filter((route) => !OPTIONAL_PATHS.has(route.path))
const optionalRoutes = indexable.filter((route) => OPTIONAL_PATHS.has(route.path))

function formatLlmsLink(route) {
  const url = route.path === '/' ? `${origin}/` : `${origin}${route.path}`
  const label = route.title.replace(/ — Аэромакс$/, '')
  return `- [${label}](${url}): ${route.description}`
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map((route) => {
    const loc = route.path === '/' ? `${origin}/` : `${origin}${route.path}`
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`
  })
  .join('\n')}
</urlset>
`

writeFileSync(join(ROOT, 'public/sitemap.xml'), sitemap, 'utf8')

const llmsLines = [
  '# ООО «Аэромакс»',
  '',
  '> Manufacturing as a Service (MaaS): онлайн-расчёт и производство деталей на заказ.',
  '',
  '## Основное',
  '',
  ...primaryRoutes.map(formatLlmsLink),
  '',
  '## Optional',
  '',
  ...optionalRoutes.map(formatLlmsLink),
  '',
  `- Контакты: info@aeromax-group.ru, +7 (495) 921-42-42`,
  `- Сайт: ${origin}/`,
]

writeFileSync(join(ROOT, 'public/llms.txt'), `${llmsLines.join('\n')}\n`, 'utf8')

console.log(`Generated sitemap (${indexable.length} URLs) and llms.txt`)
