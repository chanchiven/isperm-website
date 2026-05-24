import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const LOCALES = [
  'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro',
];
const SLUGS = [
  'article-what-is-spermmaxxing-2026',
  'article-sperm-health-biomarker-2026',
  'article-male-fertility-crisis-2026',
];

function collect(obj, p = '') {
  const out = [];
  if (typeof obj === 'string') out.push({p, v: obj});
  else if (Array.isArray(obj))
    obj.forEach((x, i) => out.push(...collect(x, `${p}[${i}]`)));
  else if (obj && typeof obj === 'object')
    for (const k of Object.keys(obj)) out.push(...collect(obj[k], p ? `${p}.${k}` : k));
  return out;
}

function isTrivialIdentical(pathStr, value) {
  const key = pathStr.split('.').pop();
  if (['image', 'link', 'type', 'alt'].includes(key)) return true;
  if (value.startsWith('/') || value.startsWith('http')) return true;
  if (/^(Spermmaxxing|Fertilitymaxxing|CoQ10|Looksmaxxing|isperm\.com|May 2026)$/i.test(value))
    return true;
  if (value.length <= 25) return true;
  return false;
}

const enFaq = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'messages/en/faq.json'), 'utf8')
);

const results = [];

for (const loc of LOCALES) {
  const faqPath = path.join(ROOT, 'messages', loc, 'faq.json');
  const artPath = path.join(ROOT, 'messages/articles', `${loc}.json`);

  if (!fs.existsSync(faqPath)) {
    results.push({loc, status: 'missing_faq'});
    continue;
  }

  const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  let total = 0;
  let sameAll = 0;
  let sameContent = 0;
  const flags = [];

  for (const slug of SLUGS) {
    if (!faq.articles?.[slug]) {
      flags.push(`${slug}:missing`);
      continue;
    }
    const enS = collect(enFaq.articles[slug]);
    const locS = collect(faq.articles[slug]);
    if (enS.length !== locS.length) flags.push(`${slug}:struct`);

    if (faq.articles[slug].title === enFaq.articles[slug].title) {
      flags.push(`${slug}:title_en`);
    }

    for (let i = 0; i < Math.min(enS.length, locS.length); i++) {
      total++;
      if (enS[i].v === locS[i].v) {
        sameAll++;
        if (!isTrivialIdentical(enS[i].p, enS[i].v)) sameContent++;
      }
    }
  }

  let artSync = true;
  if (fs.existsSync(artPath)) {
    const artBundle = JSON.parse(fs.readFileSync(artPath, 'utf8'));
    for (const slug of SLUGS) {
      if (
        JSON.stringify(faq.articles?.[slug]) !==
        JSON.stringify(artBundle.articles?.[slug])
      ) {
        artSync = false;
        break;
      }
    }
  } else {
    artSync = false;
  }

  const EN_PHRASES = [
    /\bWhat is Spermmaxxing\b/,
    /\bYou cannot improve what you do not track\b/,
    /\bDon't Wait for a Diagnosis\b/,
    /\bThe Fix:\b/,
    /\bFrequently Asked Questions About Spermmaxxing\b/,
    /\bIf you've spent any time on men's health\b/,
    /\bclinical-grade semen analysis\b/,
    /\bwonder if microplastics or a stressful job\b/,
    /isperm\.com Medical & Editorial Team/,
  ];
  const englishLeftovers = [];
  for (const slug of SLUGS) {
    if (!faq.articles?.[slug]) continue;
    for (const {v} of collect(faq.articles[slug])) {
      for (const re of EN_PHRASES) {
        if (re.test(v)) {
          englishLeftovers.push(`${slug}:${re.source.slice(0, 35)}`);
          break;
        }
      }
    }
  }

  const pctAll = total ? Math.round((100 * sameAll) / total) : 0;
  const pctContent = total ? Math.round((100 * sameContent) / total) : 0;

  let status = 'ok';
  if (pctContent >= 70 || flags.some((f) => f.endsWith(':title_en'))) status = 'untranslated';
  else if (pctContent >= 25) status = 'partial';

  results.push({
    loc,
    pctAll,
    pctContent,
    sameAll,
    total,
    status,
    flags: flags.join(', '),
    artSync,
    englishLeftovers: [...new Set(englishLeftovers)],
  });
}

results.sort((a, b) => b.pctContent - a.pctContent);

console.log('Locale | Content=EN% | FAQ↔articles(3) | Status | English leftovers');
console.log('-------|-------------|-----------------|--------|------------------');
for (const r of results) {
  if (r.status === 'missing_faq') {
    console.log(`${r.loc.padEnd(6)} | —           | —               | MISSING`);
    continue;
  }
  const leftovers = r.englishLeftovers?.length
    ? r.englishLeftovers.slice(0, 2).join('; ')
    : '—';
  console.log(
    `${r.loc.padEnd(6)} | ${String(r.pctContent).padStart(10)}% | ${(r.artSync ? 'sync' : 'OUT OF SYNC').padEnd(15)} | ${r.status.toUpperCase().padEnd(6)} | ${leftovers}`
  );
}

const bad = results.filter((r) => r.status === 'untranslated');
const partial = results.filter((r) => r.status === 'partial');
console.log(`\nSummary: ${bad.length} untranslated, ${partial.length} partial, ${results.filter((r) => r.status === 'ok').length} ok`);
