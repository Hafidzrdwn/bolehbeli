import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const DIST_DIR = path.resolve('dist')
const INDEX_HTML = path.join(DIST_DIR, 'index.html')

const BUDGETS = {
  jsGzipKb: 100,
  cssGzipKb: 15,
  precacheRawKb: 435, // DESIGN_SPEC §2.1 & §9: baseline 400 KB + font variable <= 35 KB
}

function getGzipSize(filePath) {
  const content = fs.readFileSync(filePath)
  return zlib.gzipSync(content).length
}

function extractInitialAssets(html) {
  const jsFiles = []
  const cssFiles = []

  const scriptMatches = html.matchAll(/<script\s+[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/g)
  for (const m of scriptMatches) jsFiles.push(m[1].replace(/^\//, ''))

  const preloadMatches = html.matchAll(/<link\s+[^>]*rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/g)
  for (const m of preloadMatches) jsFiles.push(m[1].replace(/^\//, ''))

  const cssMatches = html.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)
  for (const m of cssMatches) cssFiles.push(m[1].replace(/^\//, ''))

  return { jsFiles: [...new Set(jsFiles)], cssFiles: [...new Set(cssFiles)] }
}

function calculatePrecacheRawSize(dir) {
  let totalBytes = 0
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      totalBytes += calculatePrecacheRawSize(fullPath)
    } else if (entry.isFile()) {
      if (!entry.name.startsWith('sw.js') && !entry.name.startsWith('workbox-')) {
        totalBytes += fs.statSync(fullPath).size
      }
    }
  }

  return totalBytes
}

function formatRow(label, actualKb, maxKb) {
  const passed = actualKb <= maxKb
  const status = passed ? '✅ PASS' : '❌ FAIL'
  return `${label.padEnd(26)}: ${actualKb.toFixed(2).padStart(7)} KB / max ${maxKb} KB  [${status}]`
}

function run() {
  if (!fs.existsSync(INDEX_HTML)) {
    // eslint-disable-next-line no-console
    console.error('dist/index.html tidak ditemukan. Jalankan pnpm build terlebih dahulu.')
    process.exit(1)
  }

  const html = fs.readFileSync(INDEX_HTML, 'utf-8')
  const { jsFiles, cssFiles } = extractInitialAssets(html)

  const jsGzipBytes = jsFiles.reduce((acc, f) => acc + getGzipSize(path.join(DIST_DIR, f)), 0)
  const cssGzipBytes = cssFiles.reduce((acc, f) => acc + getGzipSize(path.join(DIST_DIR, f)), 0)
  const precacheRawBytes = calculatePrecacheRawSize(DIST_DIR)

  const jsGzipKb = jsGzipBytes / 1024
  const cssGzipKb = cssGzipBytes / 1024
  const precacheRawKb = precacheRawBytes / 1024

  // eslint-disable-next-line no-console
  console.log('\n=== Bundle & Precache Budget Report ===')
  // eslint-disable-next-line no-console
  console.log(formatRow('Initial JS (gzip)', jsGzipKb, BUDGETS.jsGzipKb))
  // eslint-disable-next-line no-console
  console.log(formatRow('Initial CSS (gzip)', cssGzipKb, BUDGETS.cssGzipKb))
  // eslint-disable-next-line no-console
  console.log(formatRow('Total Precache (raw)', precacheRawKb, BUDGETS.precacheRawKb))

  const allPassed =
    jsGzipKb <= BUDGETS.jsGzipKb &&
    cssGzipKb <= BUDGETS.cssGzipKb &&
    precacheRawKb <= BUDGETS.precacheRawKb

  if (!allPassed) {
    // eslint-disable-next-line no-console
    console.error('\nBudget terlampaui!')
    process.exit(1)
  }
  // eslint-disable-next-line no-console
  console.log('Semua metrik memenuhi batas anggaran performa.\n')
}

run()
