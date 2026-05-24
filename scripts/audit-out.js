const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '../out');
const PUBLIC = path.join(__dirname, '../public');
const ROOT_STYLES = path.join(__dirname, '../styles.css');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function rel(base, file) {
  return path.relative(base, file).replace(/\\/g, '/');
}

const files = walk(OUT).map((f) => rel(OUT, f));
const html = files.filter((f) => f.endsWith('.html'));
const txt = files.filter((f) => f.endsWith('.txt'));
const js = files.filter((f) => f.endsWith('.js'));

const locales = [
  'en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'
];

const orphanTxt = txt.filter((t) => !html.includes(t.replace(/\.txt$/, '.html')));

const sitemap = fs.readFileSync(path.join(OUT, 'sitemap.xml'), 'utf8');
const urls = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) => s.replace(/<\/?loc>/g, ''));

const pubFiles = new Set(walk(PUBLIC).map((f) => rel(PUBLIC, f)));
const outSet = new Set(files);
const legacyPublicHtml = [...pubFiles].filter((f) => f.endsWith('.html'));

const largest = walk(OUT)
  .map((f) => ({file: rel(OUT, f), bytes: fs.statSync(f).size}))
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 12);

const outStyles = path.join(OUT, 'styles.css');
const cssMarkers = ['contact-submit-btn', 'search-modal-list-item', 'hover-lift-card--action'];
const outCssText = fs.existsSync(outStyles) ? fs.readFileSync(outStyles, 'utf8') : '';
const rootCssText = fs.existsSync(ROOT_STYLES) ? fs.readFileSync(ROOT_STYLES, 'utf8') : '';

const nextCssDir = path.join(OUT, '_next/static/css');
const bundledCss = fs.existsSync(nextCssDir)
  ? fs.readdirSync(nextCssDir).map((name) => ({
      name,
      mtime: fs.statSync(path.join(nextCssDir, name)).mtime.toISOString(),
      bytes: fs.statSync(path.join(nextCssDir, name)).size
    }))
  : [];

console.log(JSON.stringify({
  summary: {
    totalFiles: files.length,
    totalBytes: walk(OUT).reduce((sum, f) => sum + fs.statSync(f).size, 0),
    html: html.length,
    txtRscPayload: txt.length,
    jsChunks: js.length,
    orphanTxt
  },
  localeParity: locales.map((l) => ({
    locale: l,
    htmlPages: html.filter((h) => h.startsWith(`${l}/`)).length
  })),
  sitemap: {
    urlCount: urls.length,
    includesSearch: urls.some((u) => u.includes('/search')),
    sampleMissingFromBuild: []
  },
  staleBuildCheck: {
    outStylesMtime: fs.existsSync(outStyles) ? fs.statSync(outStyles).mtime.toISOString() : null,
    rootStylesMtime: fs.existsSync(ROOT_STYLES) ? fs.statSync(ROOT_STYLES).mtime.toISOString() : null,
    cssMarkersInOut: Object.fromEntries(cssMarkers.map((m) => [m, outCssText.includes(m)])),
    cssMarkersInSource: Object.fromEntries(cssMarkers.map((m) => [m, rootCssText.includes(m)])),
    bundledCss
  },
  legacyPublicHtmlInPublicOnly: legacyPublicHtml,
  publicHtmlNotCopiedToOut: legacyPublicHtml.filter((f) => !outSet.has(f)),
  topLevelOutDirs: fs.readdirSync(OUT, {withFileTypes: true}).filter((d) => d.isDirectory()).map((d) => d.name),
  largestFiles: largest
}, null, 2));
