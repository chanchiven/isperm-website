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

const MARKERS = [
  {name: 'intro_spermmaxxing', re: /If you've spent any time on men's health forums/},
  {name: 'intro_biomarker', re: /For decades, the narrative around sperm health has been strictly/},
  {name: 'intro_crisis', re: /If you've checked the news, listened to a health podcast/},
  {name: 'title_spermmaxxing', re: /^What is Spermmaxxing\? The 2026 Male Fertility/},
  {name: 'title_biomarker', re: /^More Than Just Fertility: Why Your Sperm/},
  {name: 'title_crisis', re: /^The "Male Fertility Crisis" Making Headlines/},
  {name: 'chapter_fix', re: /\bThe Fix:\b/},
  {name: 'chapter_dont_wait', re: /Don't Wait for a Diagnosis/},
];

const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'messages/en/faq.json'), 'utf8')
);

function walk(o, out = []) {
  if (typeof o === 'string') out.push(o);
  else if (Array.isArray(o)) o.forEach((x) => walk(x, out));
  else if (o) Object.values(o).forEach((x) => walk(x, out));
  return out;
}

const report = {};

for (const loc of LOCALES) {
  const faq = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'messages', loc, 'faq.json'), 'utf8')
  );
  const hits = [];
  for (const slug of SLUGS) {
    const art = faq.articles?.[slug];
    if (!art) {
      hits.push(`${slug}:missing`);
      continue;
    }
    if (art.title === en.articles[slug].title) hits.push(`${slug}:title_en`);

    const blob = walk(art).join('\n');
    for (const m of MARKERS) {
      if (m.name.startsWith('title_') && !m.name.includes(slug.split('-')[1])) continue;
      if (m.name === 'intro_spermmaxxing' && slug !== SLUGS[0]) continue;
      if (m.name === 'intro_biomarker' && slug !== SLUGS[1]) continue;
      if (m.name === 'intro_crisis' && slug !== SLUGS[2]) continue;
      if (m.re.test(blob)) hits.push(`${slug}:${m.name}`);
    }
  }
  if (hits.length) report[loc] = hits;
}

console.log('Locales with English leftovers in 3 articles:\n');
if (!Object.keys(report).length) {
  console.log('None found (all clear).');
} else {
  for (const [loc, hits] of Object.entries(report)) {
    console.log(`${loc}: ${hits.join(', ')}`);
  }
}
