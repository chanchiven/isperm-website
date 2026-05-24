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

const en = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'messages/en/faq.json'), 'utf8')
);

for (const loc of LOCALES) {
  const faq = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'messages', loc, 'faq.json'), 'utf8')
  );
  const issues = [];
  for (const slug of SLUGS) {
    const intro = faq.articles?.[slug]?.intro;
    const enIntro = en.articles[slug].intro;
    if (!intro) {
      issues.push(`${slug}:missing`);
      continue;
    }
    if (intro === enIntro) issues.push(`${slug}:intro_identical_en`);
    else {
      // strip author/published lines for comparison
      const strip = (s) =>
        s
          .replace(/<p><strong>[^<]+<\/strong>[^<]+<br\/><strong>[^<]+<\/strong>[^<]+<\/p>/, '')
          .trim();
      if (strip(intro) === strip(enIntro)) issues.push(`${slug}:intro_body_en`);
    }
  }
  if (issues.length) console.log(`${loc}: ${issues.join(', ')}`);
}
