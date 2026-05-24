import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const EN_PATH = path.join(ROOT, 'messages', 'articles', 'en.json');
const OUT_DIR = path.join(ROOT, 'messages', 'articles');
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || 'http://127.0.0.1:7897';
const MIN_BYTES = 20000;

const LOCALES = {
  es: 'es',
  ar: 'ar',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  tr: 'tr',
  fr: 'fr',
  pl: 'pl',
  nl: 'nl',
  ko: 'ko',
  ja: 'ja',
  vi: 'vi',
  id: 'id',
  uk: 'uk',
  bg: 'bg',
  ro: 'ro',
};

const SECTION_TITLES = {
  es: 'Artículo',
  ar: 'مقال',
  de: 'Artikel',
  it: 'Articolo',
  pt: 'Artigo',
  ru: 'Статья',
  tr: 'Makale',
  fr: 'Article',
  pl: 'Artykuł',
  nl: 'Artikel',
  ko: '기사',
  ja: '記事',
  vi: 'Bài viết',
  id: 'Artikel',
  uk: 'Стаття',
  bg: 'Статия',
  ro: 'Articol',
};

const PUBLISHED = {
  es: 'Mayo de 2026',
  ar: 'مايو 2026',
  de: 'Mai 2026',
  it: 'Maggio 2026',
  pt: 'Maio de 2026',
  ru: 'Май 2026',
  tr: 'Mayıs 2026',
  fr: 'Mai 2026',
  pl: 'Maj 2026',
  nl: 'Mei 2026',
  ko: '2026년 5월',
  ja: '2026年5月',
  vi: 'Tháng 5 năm 2026',
  id: 'Mei 2026',
  uk: 'Травень 2026',
  bg: 'Май 2026',
  ro: 'Mai 2026',
};

const AUTHOR = {
  es: 'Equipo médico y editorial de isperm.com',
  ar: 'فريق isperm.com الطبي والتحريري',
  de: 'Medizinisches & Redaktionsteam von isperm.com',
  it: 'Team medico e editoriale di isperm.com',
  pt: 'Equipe médica e editorial da isperm.com',
  ru: 'Медицинская и редакционная команда isperm.com',
  tr: 'isperm.com Tıbbi ve Editöryal Ekibi',
  fr: "Équipe médicale et éditoriale d'isperm.com",
  pl: 'Zespół medyczny i redakcyjny isperm.com',
  nl: 'Medisch en redactieteam van isperm.com',
  ko: 'isperm.com 의학 및 편집팀',
  ja: 'isperm.com 医療・編集チーム',
  vi: 'Nhóm Y khoa & Biên tập isperm.com',
  id: 'Tim Medis & Editorial isperm.com',
  uk: 'Медична та редакційна команда isperm.com',
  bg: 'Медицински и редакционен екип на isperm.com',
  ro: 'Echipa medicală și editorială isperm.com',
};

const SKIP_KEYS = new Set(['image', 'link', 'type']);
const PRESERVE_STRINGS = [
  '[Insert Link: isperm.com / Your Product Page]',
  'isperm.com',
  'Spermmaxxing',
  'Fertilitymaxxing',
  'CoQ10',
  'Looksmaxxing',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function parseArgs() {
  const force = process.argv.includes('--force');
  const localesIdx = process.argv.indexOf('--locales');
  let selected = Object.keys(LOCALES);
  if (localesIdx >= 0) {
    selected = process.argv[localesIdx + 1].split(',').map((s) => s.trim());
  } else {
    const singleIdx = process.argv.indexOf('--locale');
    if (singleIdx >= 0) {
      selected = [process.argv[singleIdx + 1]];
    }
  }
  return {force, selected};
}

function protect(text) {
  const tokens = [];
  let out = text;
  for (const literal of PRESERVE_STRINGS) {
    let start = out.indexOf(literal);
    while (start !== -1) {
      const i = tokens.length;
      tokens.push(literal);
      out = out.slice(0, start) + `⟦PH${i}⟧` + out.slice(start + literal.length);
      start = out.indexOf(literal);
    }
  }
  return {out, tokens};
}

function restore(text, tokens) {
  let out = text;
  tokens.forEach((val, i) => {
    out = out.split(`⟦PH${i}⟧`).join(val);
  });
  return out;
}

function googleTranslate(text, target, attempt = 1) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const raw = execFileSync(
      'curl.exe',
      ['-x', PROXY, '-sS', '--connect-timeout', '20', '--max-time', '60', url],
      {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024}
    );
    if (raw.trim().startsWith('<')) {
      throw new Error('HTML response');
    }
    const data = JSON.parse(raw);
    return data[0].map((part) => part[0]).join('');
  } catch (e) {
    if (attempt < 4) {
      const wait = attempt * 800;
      console.warn(`\n  retry ${attempt}/3 in ${wait}ms...`);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
      return googleTranslate(text, target, attempt + 1);
    }
    throw e;
  }
}

async function translateText(text, target) {
  if (!text?.trim()) return text;
  if (text.startsWith('/') || text.startsWith('http')) return text;

  const {out: protectedText, tokens} = protect(text);
  const max = 2800;
  let result = '';
  for (let i = 0; i < protectedText.length; i += max) {
    const chunk = protectedText.slice(i, i + max);
    if (!chunk.trim() || /^[\s<>\/⟦⟧PH\d;:&=#"'.,!?-]+$/.test(chunk)) {
      result += chunk;
      continue;
    }
    try {
      result += googleTranslate(chunk, target);
    } catch (e) {
      console.warn(`\n  chunk failed: ${e.message?.slice(0, 80)}`);
      result += chunk;
    }
    await sleep(150);
  }
  const restored = restore(result, tokens);
  if (/⟦PH\d+⟧/.test(restored)) {
    console.warn('\n  warn: placeholder left in output');
  }
  return restored;
}

async function walk(node, target, locale, keyPath = '') {
  if (Array.isArray(node)) {
    const out = [];
    for (let i = 0; i < node.length; i++) {
      out.push(await walk(node[i], target, locale, `${keyPath}[${i}]`));
    }
    return out;
  }
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.has(key)) {
        out[key] = value;
        continue;
      }
      if (key === 'author') {
        out[key] = AUTHOR[locale];
        continue;
      }
      if (key === 'published') {
        out[key] = PUBLISHED[locale];
        continue;
      }
      out[key] = await walk(value, target, locale, `${keyPath}.${key}`);
    }
    return out;
  }
  if (typeof node === 'string') {
    let s = node;
    if (keyPath.endsWith('.intro') || s.includes('Author:')) {
      s = s
        .replace(/isperm\.com Medical &amp; Editorial Team/g, AUTHOR[locale])
        .replace(/isperm\.com Medical & Editorial Team/g, AUTHOR[locale])
        .replace(/May 2026/g, PUBLISHED[locale]);
    }
    process.stdout.write('.');
    return translateText(s, target);
  }
  return node;
}

const {force, selected} = parseArgs();
const en = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

for (const locale of selected) {
  const target = LOCALES[locale];
  if (!target) {
    console.warn(`unknown locale: ${locale}`);
    continue;
  }

  const outPath = path.join(OUT_DIR, `${locale}.json`);
  if (!force && fs.existsSync(outPath) && fs.statSync(outPath).size >= MIN_BYTES) {
    console.log(`skip ${locale} (exists, ${fs.statSync(outPath).size} bytes)`);
    continue;
  }

  console.log(`\n${locale} (${target})`);
  const data = structuredClone(en);
  data.sections.article.title = SECTION_TITLES[locale];
  data.articles = await walk(data.articles, target, locale, 'articles');
  console.log('');
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`wrote ${outPath} (${fs.statSync(outPath).size} bytes)`);
}

console.log('\nBatch done.');
