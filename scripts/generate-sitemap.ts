/**
 * Google 标准 sitemap.xml 生成脚本
 * 根据项目路由结构自动生成，包含所有语言的 hreflang 及 x-default
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.isperm.com';
const LOCALES = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];
const DEFAULT_LOCALE = 'en';

const PRODUCT_SLUGS = ['nexus-dx1', 'msqa-100', 'sqa-6100vet'];

const FAQ_SLUGS = [
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

type PageType = 'home' | 'about' | 'contact' | 'products' | 'product' | 'faq' | 'faq-article' | 'search';

interface SitemapEntry {
  path: string;
  type: PageType;
}

function buildEntries(): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: '/', type: 'home' },
    { path: '/about', type: 'about' },
    { path: '/contact', type: 'contact' },
    { path: '/products', type: 'products' },
    { path: '/faq', type: 'faq' },
    { path: '/search', type: 'search' },
  ];

  for (const slug of PRODUCT_SLUGS) {
    entries.push({ path: `/products/${slug}`, type: 'product' });
  }

  for (const slug of FAQ_SLUGS) {
    entries.push({ path: `/faq/${slug}`, type: 'faq-article' });
  }

  return entries;
}

function getPriorityAndChangefreq(type: PageType): { priority: string; changefreq: string } {
  switch (type) {
    case 'home':
      return { priority: '1.0', changefreq: 'weekly' };
    case 'about':
    case 'products':
    case 'faq':
      return { priority: '0.9', changefreq: 'monthly' };
    case 'contact':
      return { priority: '0.8', changefreq: 'monthly' };
    case 'product':
      return { priority: '0.8', changefreq: 'monthly' };
    case 'faq-article':
      return { priority: '0.7', changefreq: 'monthly' };
    case 'search':
      return { priority: '0.6', changefreq: 'weekly' };
    default:
      return { priority: '0.5', changefreq: 'monthly' };
  }
}

function buildHreflangLinks(path: string): string {
  const lines: string[] = [];
  const pathPart = path === '/' ? '/' : path;
  for (const locale of LOCALES) {
    const url = `${BASE_URL}/${locale}${pathPart}`;
    lines.push(`    <xhtml:link rel="alternate" hreflang="${locale}" href="${url}"/>`);
  }
  const defaultUrl = `${BASE_URL}/${DEFAULT_LOCALE}${pathPart}`;
  lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>`);
  return lines.join('\n');
}

function getLastmod(): string {
  const now = new Date();
  return now.toISOString().replace(/\.\d{3}Z$/, '+00:00');
}

function generateUrlBlock(entry: SitemapEntry): string {
  const { priority, changefreq } = getPriorityAndChangefreq(entry.type);
  const loc = `${BASE_URL}/${DEFAULT_LOCALE}${entry.path === '/' ? '/' : entry.path}`;
  const hreflang = buildHreflangLinks(entry.path);
  const lastmod = getLastmod();

  return `  <url>
    <loc>${loc}</loc>
${hreflang}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSitemap(): string {
  const entries = buildEntries();
  const urlBlocks = entries.map(generateUrlBlock).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks}
</urlset>
`;
}

function main() {
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemap = generateSitemap();

  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`[sitemap] Generated ${outputPath}`);
}

main();
