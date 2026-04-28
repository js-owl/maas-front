/**
 * Reads Lighthouse JSON folders and writes docs/lighthouse/*-run-summary.{md,tsv}
 *
 * Local:   npm run lh:local && npm run lh:local:mobile && npm run lh:docs
 * Prod:    (after generating .lighthouse-results-prod/*.json) npm run lh:docs
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DOCS = join(ROOT, 'docs', 'lighthouse')

mkdirSync(DOCS, { recursive: true })

function parseReports(srcDir) {
  if (!existsSync(srcDir)) return null
  const files = readdirSync(srcDir).filter((f) => f.startsWith('lh-') && f.endsWith('.json'))
  if (files.length === 0) return null

  const rows = []
  for (const name of files) {
    const raw = readFileSync(join(srcDir, name), 'utf8')
    const d = JSON.parse(raw)
    const perf = d.categories.performance.score
    const bp = d.categories['best-practices'].score
    const mode = name.includes('desktop') ? 'desktop' : 'mobile'
    const slug = name.replace(/^lh-desktop-/, '').replace(/^lh-mobile-/, '').replace(/\.json$/, '')
    const url = d.finalUrl || d.requestedUrl || ''
    const audits = d.audits || {}
    const num = (id) => {
      const v = audits[id]?.numericValue
      return v != null ? Math.round(v) : ''
    }
    rows.push({
      slug,
      mode,
      perf: perf != null ? Math.round(perf * 100) : '',
      bp: bp != null ? Math.round(bp * 100) : '',
      fcp_ms: num('first-contentful-paint'),
      lcp_ms: num('largest-contentful-paint'),
      url,
    })
  }

  const bySlug = {}
  for (const r of rows) {
    if (!bySlug[r.slug]) bySlug[r.slug] = {}
    bySlug[r.slug][r.mode] = r
  }
  return bySlug
}

function writeTsv(bySlug, fileBase) {
  const slugs = Object.keys(bySlug).sort()
  const tsvLines = [
    [
      'slug',
      'desktop_perf',
      'desktop_bp',
      'desktop_fcp_ms',
      'desktop_lcp_ms',
      'mobile_perf',
      'mobile_bp',
      'mobile_fcp_ms',
      'mobile_lcp_ms',
      'url',
    ].join('\t'),
  ]
  for (const slug of slugs) {
    const dd = bySlug[slug].desktop || {}
    const dm = bySlug[slug].mobile || {}
    const url = dd.url || dm.url || ''
    tsvLines.push(
      [
        slug,
        dd.perf ?? '',
        dd.bp ?? '',
        dd.fcp_ms ?? '',
        dd.lcp_ms ?? '',
        dm.perf ?? '',
        dm.bp ?? '',
        dm.fcp_ms ?? '',
        dm.lcp_ms ?? '',
        url,
      ].join('\t'),
    )
  }
  writeFileSync(join(DOCS, `${fileBase}.tsv`), tsvLines.join('\n'), 'utf8')
}

function writeMd(bySlug, fileBase, title, footerLines) {
  const slugs = Object.keys(bySlug).sort()
  const now = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'
  const md = []
  md.push(title)
  md.push('')
  footerLines.forEach((line) => md.push(line))
  md.push('')
  md.push(`**Обновлено:** ${now}`)
  md.push('')
  md.push('| Маршрут | Desktop Perf | Desktop BP | Mobile Perf | Mobile BP |')
  md.push('|--------|-------------:|-----------:|------------:|----------:|')
  for (const slug of slugs) {
    const dd = bySlug[slug].desktop || {}
    const dm = bySlug[slug].mobile || {}
    const path = slug === 'home' ? '/' : `/${slug}`
    md.push(
      `| \`${path}\` | ${dd.perf ?? '—'} | ${dd.bp ?? '—'} | ${dm.perf ?? '—'} | ${dm.bp ?? '—'} |`,
    )
  }
  md.push('')
  md.push(...(fileBase === 'local-run-summary'
    ? [
        'Полные JSON отчёты хранятся локально в `.lighthouse-results/` (каталог в `.gitignore`). Здесь — только агрегированные цифры.',
        '',
        'Подробные метрики (FCP/LCP в мс) — в файле `local-run-summary.tsv`.',
      ]
    : [
        'Полные JSON отчёты хранятся локально в `.lighthouse-results-prod/` (каталог в `.gitignore`). Здесь — только агрегированные цифры.',
        '',
        'Подробные метрики (FCP/LCP в мс) — в файле `prod-run-summary.tsv`.',
      ]))
  md.push('')
  writeFileSync(join(DOCS, `${fileBase}.md`), md.join('\n'), 'utf8')
}

const configs = [
  {
    src: join(ROOT, '.lighthouse-results'),
    fileBase: 'local-run-summary',
    title: '# Lighthouse (local preview) — сводка',
    footer: [
      'Прогон [`npm run lh:local`](../../package.json) и [`npm run lh:local:mobile`](../../package.json) против `vite preview` (список маршрутов: [`scripts/lighthouse-local.mjs`](../../scripts/lighthouse-local.mjs)).',
      '',
      '**Категории:** только *Performance* и *Best Practices*; mobile — стандартная симуляция Lighthouse.',
    ],
  },
  {
    src: join(ROOT, '.lighthouse-results-prod'),
    fileBase: 'prod-run-summary',
    title: '# Lighthouse (production) — сводка',
    footer: [
      'Прогон против **https://maas.aeromax-group.ru** — те же маршруты, что и для локального скрипта (см. [`scripts/lighthouse-local.mjs`](../../scripts/lighthouse-local.mjs)). Команды: вручную `npx lighthouse <url> ...` или свой цикл по URL.',
      '',
      '**Категории:** только *Performance* и *Best Practices*; mobile — стандартная симуляция Lighthouse.',
    ],
  },
]

for (const c of configs) {
  const bySlug = parseReports(c.src)
  if (!bySlug) {
    console.warn(`Skip ${c.fileBase}: no JSON in ${c.src}`)
    continue
  }
  writeTsv(bySlug, c.fileBase)
  writeMd(bySlug, c.fileBase, c.title, c.footer)
  console.log(`Wrote docs/lighthouse/${c.fileBase}.md`)
  console.log(`Wrote docs/lighthouse/${c.fileBase}.tsv`)
}
