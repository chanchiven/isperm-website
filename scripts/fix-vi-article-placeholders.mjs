import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');
// Closing `}` was sometimes dropped when corrupt blocks abutted HTML tags.
const CORRUPT =
  /\(\) => \{\s*(?:là gì\s*)?const i = token\.length;\s*token\.push\(nghĩa đen\);\s*trả về `⟦PH\$\{i\}⟧`;\s*\}?/g;
const PRESERVE_RE =
  /\[Insert Link: isperm\.com \/ Your Product Page\]|isperm\.com|Spermmaxxing|Fertilitymaxxing|CoQ10|Looksmaxxing/g;

const SLUGS = [
  'article-what-is-spermmaxxing-2026',
  'article-sperm-health-biomarker-2026',
  'article-male-fertility-crisis-2026',
];

function extractPreserves(en) {
  const tokens = [];
  en.replace(PRESERVE_RE, (m) => {
    tokens.push(m);
    return m;
  });
  return tokens;
}

function fixString(en, vi) {
  const tokens = [];
  en.replace(PRESERVE_RE, (m) => {
    tokens.push(m);
    return m;
  });
  let i = 0;
  const fixed = vi.replace(CORRUPT, () => {
    if (i >= tokens.length) {
      console.warn('  warn: more corrupt blocks than preserve tokens');
      return 'Spermmaxxing';
    }
    return tokens[i++];
  });
  const remaining = (fixed.match(CORRUPT) || []).length;
  if (remaining) {
    console.warn(`  warn: ${remaining} corrupt block(s) left`);
  }
  if (i < tokens.length) {
    console.warn(`  warn: ${tokens.length - i} preserve token(s) unused`);
  }
  return fixed;
}

function walkFix(enNode, viNode, path = '') {
  if (typeof enNode === 'string' && typeof viNode === 'string') {
    if (CORRUPT.test(viNode) || PRESERVE_RE.test(enNode)) {
      CORRUPT.lastIndex = 0;
      PRESERVE_RE.lastIndex = 0;
      return fixString(enNode, viNode);
    }
    return viNode;
  }
  if (Array.isArray(enNode) && Array.isArray(viNode)) {
    return enNode.map((item, idx) => walkFix(item, viNode[idx], `${path}[${idx}]`));
  }
  if (enNode && viNode && typeof enNode === 'object' && typeof viNode === 'object') {
    const out = {...viNode};
    for (const key of Object.keys(enNode)) {
      if (viNode[key] === undefined) continue;
      out[key] = walkFix(enNode[key], viNode[key], path ? `${path}.${key}` : key);
    }
    return out;
  }
  return viNode;
}

const enFaq = JSON.parse(fs.readFileSync(path.join(ROOT, 'messages/en/faq.json'), 'utf8'));
const viFaqPath = path.join(ROOT, 'messages/vi/faq.json');
const viArticlesPath = path.join(ROOT, 'messages/articles/vi.json');
const viFaq = JSON.parse(fs.readFileSync(viFaqPath, 'utf8'));
const viArticles = JSON.parse(fs.readFileSync(viArticlesPath, 'utf8'));

let fixedCount = 0;
for (const slug of SLUGS) {
  const before = JSON.stringify(viFaq.articles[slug]).includes('() => {');
  viFaq.articles[slug] = walkFix(enFaq.articles[slug], viFaq.articles[slug], slug);
  viArticles.articles[slug] = walkFix(enFaq.articles[slug], viArticles.articles[slug], slug);
  const after = JSON.stringify(viFaq.articles[slug]).includes('() => {');
  if (before && !after) fixedCount++;
  console.log(`${slug}: ${before ? (after ? 'PARTIAL' : 'fixed') : 'ok'}`);
}

fs.writeFileSync(viFaqPath, `${JSON.stringify(viFaq, null, 2)}\n`);
fs.writeFileSync(viArticlesPath, `${JSON.stringify(viArticles, null, 2)}\n`);
console.log(`\nWrote ${viFaqPath}`);
console.log(`Wrote ${viArticlesPath}`);
console.log(`Articles fixed: ${fixedCount}/${SLUGS.length}`);
