import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ALL_LOCALES = [
  'en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro',
];

const localesIdx = process.argv.indexOf('--locales');
const LOCALES =
  localesIdx >= 0
    ? process.argv[localesIdx + 1].split(',').map((s) => s.trim())
    : ALL_LOCALES;
const ARTICLE_DIR = path.join(ROOT, 'messages', 'articles');

for (const locale of LOCALES) {
  const articlePath = path.join(ARTICLE_DIR, `${locale}.json`);
  const faqPath = path.join(ROOT, 'messages', locale, 'faq.json');

  if (!fs.existsSync(articlePath)) {
    console.warn(`skip ${locale}: missing ${articlePath}`);
    continue;
  }
  if (fs.statSync(articlePath).size < 15000) {
    console.warn(`skip ${locale}: ${articlePath} too small (incomplete?)`);
    continue;
  }
  if (!fs.existsSync(faqPath)) {
    console.warn(`skip ${locale}: missing ${faqPath}`);
    continue;
  }

  const bundle = JSON.parse(fs.readFileSync(articlePath, 'utf8'));
  const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));

  faq.sections = faq.sections || {};
  faq.sections.article = bundle.sections.article;

  faq.articles = faq.articles || {};
  for (const [slug, article] of Object.entries(bundle.articles)) {
    faq.articles[slug] = article;
  }

  fs.writeFileSync(faqPath, `${JSON.stringify(faq, null, 2)}\n`);
  console.log(`merged ${locale}`);
}
