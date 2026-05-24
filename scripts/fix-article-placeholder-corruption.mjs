import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');

// Failed Google-translate placeholder restore (varies by locale).
const CORRUPT_BLOCKS = [
  /\(\) => \{[\s\S]*?⟦PH\$\{i\}⟧`[\s\S]*?\}/g,
  /\(\) => \{[\s\S]*?⟦PH\$\{i\}⟧`[\s\S]*?(?=<)/g,
  /⟧`[\s;\u00a0]*\}?\s*/g,
  /Un \(\) scientifiquement soutenu => \{[\s\S]*?\}\s*/g,
];

function stripCorruption(text) {
  let out = text;
  for (let pass = 0; pass < 6; pass++) {
    let next = out;
    for (const re of CORRUPT_BLOCKS) {
      next = next.replace(re, '');
    }
    if (next === out) break;
    out = next;
  }
  return out;
}

const PRESERVE_RE =
  /\[Insert Link: isperm\.com \/ Your Product Page\]|isperm\.com|Spermmaxxing|Fertilitymaxxing|CoQ10|Looksmaxxing/g;

const SLUGS = [
  'article-what-is-spermmaxxing-2026',
  'article-sperm-health-biomarker-2026',
  'article-male-fertility-crisis-2026',
];

function fixString(en, target) {
  const tokens = [];
  en.replace(PRESERVE_RE, (m) => {
    tokens.push(m);
    return m;
  });
  let i = 0;
  const nextToken = () => {
    if (i >= tokens.length) {
      console.warn('  warn: more corrupt blocks than preserve tokens');
      return 'Spermmaxxing';
    }
    return tokens[i++];
  };
  let fixed = target;
  for (const re of CORRUPT_BLOCKS) {
    fixed = fixed.replace(re, nextToken);
  }
  fixed = fixed.replace(/⟦PH\$\{i\}⟧`?/g, nextToken);
  return fixed;
}

function needsFix(s) {
  return (
    s.includes('() => {') ||
    s.includes('⟦PH') ||
    s.includes('⟧`') ||
    s.includes('jetons.push') ||
    s.includes('token.push(literal')
  );
}

function walkFix(enNode, targetNode) {
  if (typeof enNode === 'string' && typeof targetNode === 'string') {
    if (needsFix(targetNode) || PRESERVE_RE.test(enNode)) {
      PRESERVE_RE.lastIndex = 0;
      return fixString(enNode, targetNode);
    }
    return targetNode;
  }
  if (Array.isArray(enNode) && Array.isArray(targetNode)) {
    return enNode.map((item, idx) => walkFix(item, targetNode[idx]));
  }
  if (
    enNode &&
    targetNode &&
    typeof enNode === 'object' &&
    typeof targetNode === 'object'
  ) {
    const out = {...targetNode};
    for (const key of Object.keys(enNode)) {
      if (targetNode[key] === undefined) continue;
      out[key] = walkFix(enNode[key], targetNode[key]);
    }
    return out;
  }
  return targetNode;
}

function localesFromArgs() {
  const idx = process.argv.indexOf('--locales');
  if (idx >= 0) {
    return process.argv[idx + 1].split(',').map((s) => s.trim());
  }
  const files = [];
  const scan = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) scan(full);
      else if (entry.name.endsWith('.json')) files.push(full);
    }
  };
  scan(path.join(ROOT, 'messages'));
  const locales = new Set();
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('() => {')) {
      const m = file.match(/messages[\\/](articles[\\/])?([a-z]{2})\.json$/i);
      if (m) locales.add(m[2]);
      else if (file.includes(`${path.sep}faq.json`)) {
        const loc = path.basename(path.dirname(file));
        if (loc !== 'articles') locales.add(loc);
      }
    }
  }
  return [...locales];
}

const enFaq = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'messages/en/faq.json'), 'utf8')
);
const locales = localesFromArgs();

if (locales.length === 0) {
  console.log('No corrupted locales found.');
  process.exit(0);
}

console.log('Fixing locales:', locales.join(', '));

for (const locale of locales) {
  const faqPath = path.join(ROOT, 'messages', locale, 'faq.json');
  const articlesPath = path.join(ROOT, 'messages/articles', `${locale}.json`);

  if (!fs.existsSync(faqPath)) {
    console.warn(`skip ${locale}: no faq.json`);
    continue;
  }

  const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  let articles = null;
  if (fs.existsSync(articlesPath)) {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  }

  for (const slug of SLUGS) {
    if (!enFaq.articles[slug]) continue;
    if (faq.articles?.[slug]) {
      faq.articles[slug] = walkFix(enFaq.articles[slug], faq.articles[slug]);
    }
    if (articles?.articles?.[slug]) {
      articles.articles[slug] = walkFix(
        enFaq.articles[slug],
        articles.articles[slug]
      );
    }
  }

  const faqBefore = JSON.stringify(faq).includes('() => {');
  fs.writeFileSync(faqPath, `${JSON.stringify(faq, null, 2)}\n`);
  console.log(`${locale}/faq.json: ${faqBefore ? 'fixed' : 'unchanged'}`);

  if (articles) {
    const artBefore = JSON.stringify(articles).includes('() => {');
    fs.writeFileSync(articlesPath, `${JSON.stringify(articles, null, 2)}\n`);
    console.log(`articles/${locale}.json: ${artBefore ? 'fixed' : 'unchanged'}`);
  }
}
