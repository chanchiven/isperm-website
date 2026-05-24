import fs from 'fs';
import path from 'path';
import {execFileSync} from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || 'http://127.0.0.1:7897';

const LOCALES = {
  en: 'en',
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

const SLUGS = [
  'faq-human-semen-standards',
  'faq-bull-breeding-soundness',
  'faq-canine-semen-analysis',
  'faq-poultry-semen-analysis',
  'faq-stallion-semen-analysis',
  'faq-camelid-andrology',
  'faq-fish-semen-analysis',
  'faq-ram-breeding-soundness',
  'faq-boar-semen-evaluation',
  'who-6th-edition-semen-analysis-standards',
  'iso-23162-2021-laboratory-competence-guide',
  'eshre-guidelines-clinical-semen-examination',
  'asrm-male-infertility-evaluation-protocols',
];

/** English SEO descriptions (~150–160 chars). */
const META_EN = {
  'faq-human-semen-standards':
    'Compare WHO 6th Edition, ISO 23162, ESHRE and ASRM standards for human semen analysis. Guide to pre-analytical quality, CASA, motility, morphology and lab excellence.',
  'faq-bull-breeding-soundness':
    'Complete guide to bull breeding soundness examination (BSE): SFT clinical standards, physical exam, semen collection, CASA motility and morphology for cattle fertility.',
  'faq-canine-semen-analysis':
    'Professional canine semen analysis guide: dog fertility standards, collection, motility, morphology and CASA for veterinary reproduction and breeding programs.',
  'faq-poultry-semen-analysis':
    'Poultry semen analysis standards for rooster fertility: collection, macroscopic assessment, motility, morphology and hatchery broodstock management.',
  'faq-stallion-semen-analysis':
    'Equine breeding soundness and stallion semen analysis: EBSE standards, collection, motility, morphology and cooled-shipped semen for horse fertility.',
  'faq-camelid-andrology':
    'Camelid andrology guide: camel and alpaca fertility evaluation, semen collection challenges, motility, morphology and digital CASA analysis.',
  'faq-fish-semen-analysis':
    'Fish semen analysis for broodstock and hatcheries: sperm concentration, motility, morphology, cryopreservation and aquatic reproduction standards.',
  'faq-ram-breeding-soundness':
    'Ram breeding soundness examination (RBSE): seasonal fertility, physical exam, semen evaluation, motility and morphology for sheep reproduction.',
  'faq-boar-semen-evaluation':
    'Boar semen evaluation and AI dose processing: BBSE standards, collection, motility, morphology, extender dilution and biosecurity.',
  'who-6th-edition-semen-analysis-standards':
    'WHO 6th Edition semen analysis standards with CASA technology: reference limits, motility grading, 37°C testing, morphology and ISO 23162 alignment.',
  'iso-23162-2021-laboratory-competence-guide':
    'ISO 23162:2021 laboratory competence for human semen examination: technical requirements, CASA validation, quality control and standardized reporting.',
  'eshre-guidelines-clinical-semen-examination':
    'ESHRE guidelines for clinical semen examination: integrating lab results into IVF, ICSI and IUI decisions for evidence-based reproductive care.',
  'asrm-male-infertility-evaluation-protocols':
    'ASRM male infertility evaluation protocols: semen analysis in clinical pathways, workup standards, IUI/IVF/ICSI decisions and quality care.',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function googleTranslate(text, target, attempt = 1) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const raw = execFileSync(
      'curl.exe',
      ['-x', PROXY, '-sS', '--connect-timeout', '20', '--max-time', '60', url],
      {encoding: 'utf8', maxBuffer: 10 * 1024 * 1024}
    );
    if (raw.trim().startsWith('<')) throw new Error('HTML response');
    const data = JSON.parse(raw);
    return data[0].map((part) => part[0]).join('');
  } catch (e) {
    if (attempt < 4) {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, attempt * 800);
      return googleTranslate(text, target, attempt + 1);
    }
    throw e;
  }
}

function insertMetaDescription(article, metaDescription) {
  if (article.metaDescription) return false;
  article.metaDescription = metaDescription;
  return true;
}

async function translateMeta(slug, target) {
  if (target === 'en') return META_EN[slug];
  return googleTranslate(META_EN[slug], target);
}

const localesIdx = process.argv.indexOf('--locales');
const selected =
  localesIdx >= 0
    ? process.argv[localesIdx + 1].split(',').map((s) => s.trim())
    : Object.keys(LOCALES);

for (const locale of selected) {
  const target = LOCALES[locale];
  if (!target) {
    console.warn(`unknown locale: ${locale}`);
    continue;
  }

  const faqPath = path.join(ROOT, 'messages', locale, 'faq.json');
  const articlesPath = path.join(ROOT, 'messages', 'articles', `${locale}.json`);

  if (!fs.existsSync(faqPath)) {
    console.warn(`skip ${locale}: no faq.json`);
    continue;
  }

  const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  let updated = 0;

  for (const slug of SLUGS) {
    if (!faq.articles?.[slug]) continue;
    if (faq.articles[slug].metaDescription) continue;

    let meta;
    try {
      meta = await translateMeta(slug, target);
      await sleep(target === 'en' ? 0 : 120);
    } catch (e) {
      console.warn(`  ${slug}: translate failed — ${e.message?.slice(0, 60)}`);
      if (locale !== 'en') meta = META_EN[slug];
      else continue;
    }

    if (insertMetaDescription(faq.articles[slug], meta)) {
      updated++;
    }
  }

  fs.writeFileSync(faqPath, `${JSON.stringify(faq, null, 2)}\n`);
  console.log(`${locale}/faq.json: added ${updated} metaDescription(s)`);

  if (fs.existsSync(articlesPath)) {
    const bundle = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
    let artUpdated = 0;
    for (const slug of SLUGS) {
      if (!bundle.articles?.[slug] || bundle.articles[slug].metaDescription) continue;
      if (faq.articles[slug]?.metaDescription) {
        insertMetaDescription(bundle.articles[slug], faq.articles[slug].metaDescription);
        artUpdated++;
      }
    }
    if (artUpdated) {
      fs.writeFileSync(articlesPath, `${JSON.stringify(bundle, null, 2)}\n`);
      console.log(`  articles/${locale}.json: synced ${artUpdated}`);
    }
  }
}

console.log('\nDone.');
