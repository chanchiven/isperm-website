/**
 * 搜索索引构建脚本
 * 扫描所有内容并生成搜索索引文件
 */

import fs from 'fs';
import path from 'path';
import { SearchIndex, ProductIndex, ArticleIndex, PageIndex, ImageIndex } from '../lib/search/types';

const LOCALES = ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'];
const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'search-index');

// 产品 slug 列表
const PRODUCT_SLUGS = ['nexus-dx1', 'msqa-100', 'sqa-6100vet'];

// 文章 slug 列表
const ARTICLE_SLUGS = [
  'faq-human-semen-standards',
  'who-6th-edition-semen-analysis-standards',
  'iso-23162-2021-laboratory-competence-guide',
  'eshre-guidelines-clinical-semen-examination',
  'asrm-male-infertility-evaluation-protocols',
  'faq-bull-breeding-soundness',
  'faq-canine-semen-analysis',
  'faq-poultry-semen-analysis',
  'faq-stallion-semen-analysis',
  'faq-camelid-andrology',
  'faq-fish-semen-analysis',
  'faq-ram-breeding-soundness',
  'faq-boar-semen-evaluation'
];

// 人类和兽医文章分类
const HUMAN_ARTICLES = [
  'faq-human-semen-standards',
  'who-6th-edition-semen-analysis-standards',
  'iso-23162-2021-laboratory-competence-guide',
  'eshre-guidelines-clinical-semen-examination',
  'asrm-male-infertility-evaluation-protocols'
];

function loadJSON(locale: string, file: string): any {
  const filePath = path.join(MESSAGES_DIR, locale, file);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    // 读取文件并移除 BOM (Byte Order Mark)
    let content = fs.readFileSync(filePath, 'utf-8');
    // 移除 BOM (U+FEFF)
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

function extractTextFromContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map(item => extractTextFromContent(item)).join(' ');
  }
  if (typeof content === 'object' && content !== null) {
    return Object.values(content)
      .map(value => extractTextFromContent(value))
      .join(' ');
  }
  return '';
}

function buildProductIndex(locale: string): ProductIndex[] {
  const productsData = loadJSON(locale, 'products.json');
  if (!productsData || !productsData.products) {
    return [];
  }

  const products: ProductIndex[] = [];

  // Nexus Dx1
  if (productsData.products.nexus) {
    const nexus = productsData.products.nexus;
    const features: string[] = [];
    if (nexus.detail?.keyFeatures?.items) {
      features.push(...nexus.detail.keyFeatures.items);
    }
    if (nexus.feature1) features.push(nexus.feature1);
    if (nexus.feature2) features.push(nexus.feature2);
    if (nexus.feature3) features.push(nexus.feature3);

    products.push({
      id: 'nexus-dx1',
      slug: 'nexus-dx1',
      name: nexus.name || '',
      description: nexus.description || nexus.detail?.description || '',
      subtitle: nexus.subtitle || nexus.heroSubtitle || '',
      images: ['/nexus-dx1-cover.webp', '/nexus-dx1.webp', '/nexus-dx1-2.webp', '/nexus-dx1-3.webp', '/nexus-dx1-4.webp'],
      features,
      locale
    });
  }

  // MSQA-100
  if (productsData.products.msqa) {
    const msqa = productsData.products.msqa;
    const features: string[] = [];
    if (msqa.detail?.keyFeatures?.items) {
      features.push(...msqa.detail.keyFeatures.items);
    }
    if (msqa.feature1) features.push(msqa.feature1);
    if (msqa.feature2) features.push(msqa.feature2);
    if (msqa.feature3) features.push(msqa.feature3);

    products.push({
      id: 'msqa-100',
      slug: 'msqa-100',
      name: msqa.name || '',
      description: msqa.description || msqa.detail?.description || '',
      subtitle: msqa.subtitle || msqa.heroSubtitle || '',
      images: ['/MSQA-100/msqa-100-cover.webp', '/MSQA-100/msqa-100-1.webp', '/MSQA-100/msqa-100-2.webp'],
      features,
      locale
    });
  }

  // SQA-6100Vet
  if (productsData.products.sqavet) {
    const sqavet = productsData.products.sqavet;
    const features: string[] = [];
    if (sqavet.detail?.keyFeatures?.items) {
      features.push(...sqavet.detail.keyFeatures.items);
    }
    if (sqavet.feature1) features.push(sqavet.feature1);
    if (sqavet.feature2) features.push(sqavet.feature2);
    if (sqavet.feature3) features.push(sqavet.feature3);

    products.push({
      id: 'sqa-6100vet',
      slug: 'sqa-6100vet',
      name: sqavet.name || '',
      description: sqavet.description || sqavet.detail?.description || '',
      subtitle: sqavet.subtitle || sqavet.heroSubtitle || '',
      images: ['/sqa-6100vet-cover.webp', '/sqa-6100vet-1.webp', '/sqa-6100vet-2.webp'],
      features,
      locale
    });
  }

  return products;
}

function buildArticleIndex(locale: string): ArticleIndex[] {
  const faqData = loadJSON(locale, 'faq.json');
  if (!faqData || !faqData.articles) {
    return [];
  }

  const articles: ArticleIndex[] = [];

  for (const slug of ARTICLE_SLUGS) {
    const article = faqData.articles[slug];
    if (!article) continue;

    // 提取内容文本（用于搜索）
    let contentText = '';
    if (article.intro) contentText += article.intro + ' ';
    if (article.chapters && Array.isArray(article.chapters)) {
      contentText += extractTextFromContent(article.chapters);
    }
    if (article.conclusion) contentText += article.conclusion + ' ';

    // 限制内容长度（用于搜索索引）
    contentText = contentText.substring(0, 500);

    articles.push({
      id: slug,
      slug,
      title: article.title || '',
      subtitle: article.subtitle || '',
      content: contentText,
      image: article.image || '',
      alt: article.alt || '',
      category: HUMAN_ARTICLES.includes(slug) ? 'human' : 'veterinary',
      locale
    });
  }

  return articles;
}

function buildPageIndex(locale: string): PageIndex[] {
  const pages: PageIndex[] = [];

  // 首页
  const indexData = loadJSON(locale, 'index.json');
  if (indexData && indexData.meta) {
    pages.push({
      id: 'home',
      path: '/',
      title: indexData.meta.title || '',
      description: indexData.meta.description || '',
      locale
    });
  }

  // 关于页面
  const aboutData = loadJSON(locale, 'about.json');
  if (aboutData && aboutData.meta) {
    pages.push({
      id: 'about',
      path: '/about',
      title: aboutData.meta.title || '',
      description: aboutData.meta.description || '',
      locale
    });
  }

  // 联系页面
  const contactData = loadJSON(locale, 'contact.json');
  if (contactData && contactData.meta) {
    pages.push({
      id: 'contact',
      path: '/contact',
      title: contactData.meta.title || '',
      description: contactData.meta.description || '',
      locale
    });
  }

  // 产品列表页
  const productsData = loadJSON(locale, 'products.json');
  if (productsData && productsData.meta) {
    pages.push({
      id: 'products',
      path: '/products',
      title: productsData.meta.title || '',
      description: productsData.meta.description || '',
      locale
    });
  }

  // FAQ 列表页
  const faqData = loadJSON(locale, 'faq.json');
  if (faqData && faqData.meta) {
    pages.push({
      id: 'faq',
      path: '/faq',
      title: faqData.meta.title || '',
      description: faqData.meta.description || '',
      locale
    });
  }

  return pages;
}

function buildImageIndex(locale: string): ImageIndex[] {
  const images: ImageIndex[] = [];
  const productsData = loadJSON(locale, 'products.json');
  const faqData = loadJSON(locale, 'faq.json');
  const aboutData = loadJSON(locale, 'about.json');
  const indexData = loadJSON(locale, 'index.json');

  // 产品图片
  if (productsData && productsData.products) {
    // Nexus Dx1 图片
    if (productsData.products.nexus) {
      const nexusImages = ['/nexus-dx1-cover.webp', '/nexus-dx1.webp', '/nexus-dx1-2.webp', '/nexus-dx1-3.webp', '/nexus-dx1-4.webp'];
      nexusImages.forEach((src, index) => {
        images.push({
          id: `nexus-dx1-${index}`,
          src,
          alt: `${productsData.products.nexus.name || 'Nexus Dx1'} - Product image ${index + 1}`,
          filename: path.basename(src),
          type: 'product',
          associatedContent: {
            type: 'product',
            id: 'nexus-dx1',
            title: productsData.products.nexus.name || '',
            url: `/products/nexus-dx1`
          },
          locale
        });
      });
    }

    // MSQA-100 图片
    if (productsData.products.msqa) {
      const msqaImages = ['/MSQA-100/msqa-100-cover.webp', '/MSQA-100/msqa-100-1.webp', '/MSQA-100/msqa-100-2.webp'];
      msqaImages.forEach((src, index) => {
        images.push({
          id: `msqa-100-${index}`,
          src,
          alt: `${productsData.products.msqa.name || 'MSQA-100'} - Product image ${index + 1}`,
          filename: path.basename(src),
          type: 'product',
          associatedContent: {
            type: 'product',
            id: 'msqa-100',
            title: productsData.products.msqa.name || '',
            url: `/products/msqa-100`
          },
          locale
        });
      });
    }

    // SQA-6100Vet 图片
    if (productsData.products.sqavet) {
      const sqavetImages = ['/sqa-6100vet-cover.webp', '/sqa-6100vet-1.webp', '/sqa-6100vet-2.webp'];
      sqavetImages.forEach((src, index) => {
        images.push({
          id: `sqa-6100vet-${index}`,
          src,
          alt: `${productsData.products.sqavet.name || 'SQA-6100Vet'} - Product image ${index + 1}`,
          filename: path.basename(src),
          type: 'product',
          associatedContent: {
            type: 'product',
            id: 'sqa-6100vet',
            title: productsData.products.sqavet.name || '',
            url: `/products/sqa-6100vet`
          },
          locale
        });
      });
    }
  }

  // FAQ 文章图片
  if (faqData && faqData.articles) {
    for (const slug of ARTICLE_SLUGS) {
      const article = faqData.articles[slug];
      if (article && article.image) {
        images.push({
          id: `article-${slug}`,
          src: article.image,
          alt: article.alt || article.title || '',
          filename: path.basename(article.image),
          type: 'article',
          associatedContent: {
            type: 'article',
            id: slug,
            title: article.title || '',
            url: `/faq/${slug}`
          },
          locale
        });
      }
    }
  }

  // 关于页面图片
  if (aboutData && aboutData.showcase) {
    const showcaseImages = [
      '/About%20us%20(1).webp',
      '/About%20us%20(2).webp',
      '/About%20Us%202.webp',
      '/About%20Us%204.webp',
      '/About%20Us%205.webp'
    ];
    showcaseImages.forEach((src, index) => {
      const altKey = `showcase.images.image${index + 1}.alt`;
      const alt = aboutData.showcase?.images?.[`image${index + 1}`]?.alt || '';
      images.push({
        id: `about-${index}`,
        src,
        alt,
        filename: path.basename(src),
        type: 'about',
        associatedContent: {
          type: 'page',
          id: 'about',
          title: aboutData.meta?.title || 'About Us',
          url: '/about'
        },
        locale
      });
    });
  }

  // Banner 图片
  const banners = ['/banner%20(1).webp', '/banner%20(2).webp', '/banner%20(3).webp'];
  banners.forEach((src, index) => {
    images.push({
      id: `banner-${index}`,
      src,
      alt: `iSperm Medical - Banner image ${index + 1}`,
      filename: path.basename(src),
      type: 'banner',
      associatedContent: {
        type: 'page',
        id: 'home',
        title: indexData?.meta?.title || 'iSperm Medical',
        url: '/'
      },
      locale
    });
  });

  return images;
}

function buildIndexForLocale(locale: string): SearchIndex {
  console.log(`Building search index for locale: ${locale}`);

  const products = buildProductIndex(locale);
  const articles = buildArticleIndex(locale);
  const pages = buildPageIndex(locale);
  const images = buildImageIndex(locale);

  return {
    products,
    articles,
    pages,
    images,
    locale
  };
}

function main() {
  console.log('Building search indexes...');

  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 为每种语言构建索引
  for (const locale of LOCALES) {
    try {
      const index = buildIndexForLocale(locale);
      const outputPath = path.join(OUTPUT_DIR, `${locale}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8');
      console.log(`✓ Generated index for ${locale}: ${index.products.length} products, ${index.articles.length} articles, ${index.pages.length} pages, ${index.images.length} images`);
    } catch (error) {
      console.error(`Error building index for ${locale}:`, error);
    }
  }

  console.log('\n✓ Search index build complete!');
}

if (require.main === module) {
  main();
}

export { buildIndexForLocale };
