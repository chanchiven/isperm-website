import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {generateHreflangAlternates} from '@/i18n/hreflang';
import {routing} from '@/i18n/routing';

// Helper function to add internal links for CASA and Nexus DX1 in HTML content
function processContentWithInternalLinks(content: string, locale: string): string {
  // Split content by HTML tags to process text nodes separately
  const htmlTagRegex = /(<[^>]+>)/g;
  const parts = content.split(htmlTagRegex);
  let accumulatedText = '';
  
  // Process each part
  parts.forEach((part, index) => {
    // Only process text nodes (not HTML tags)
    if (!part.match(/^<[^>]+>$/)) {
      let processedPart = part;
      
      // First, handle URLs (but not inside existing <a> tags)
      const urlRegex = /(https?:\/\/[^\s<>"']+)/g;
      processedPart = processedPart.replace(urlRegex, (url, matchOffset) => {
        // Check if this URL is already inside an <a> tag
        const textBeforeMatch = accumulatedText + processedPart.substring(0, matchOffset);
        const lastOpenTag = textBeforeMatch.lastIndexOf('<a');
        const lastCloseTag = textBeforeMatch.lastIndexOf('</a>');
        
        // If we're inside an <a> tag, don't replace
        if (lastOpenTag > lastCloseTag) {
          return url;
        }
        
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); text-decoration: underline;">${url}</a>`;
      });
      
      // Then, handle internal links (CASA and Nexus DX1)
      const patterns = [
        { pattern: /\bCASA\b/gi, link: `/products/nexus-dx1` },
        { pattern: /\bNexus DX1\b/gi, link: `/products/nexus-dx1` },
        { pattern: /\bNexus Dx-1\b/gi, link: `/products/nexus-dx1` }
      ];
      
      patterns.forEach(({ pattern, link }) => {
        processedPart = processedPart.replace(pattern, (match, matchOffset) => {
          // Check if the match is not inside an existing <a> tag
          const textBeforeMatch = accumulatedText + processedPart.substring(0, matchOffset);
          const lastOpenTag = textBeforeMatch.lastIndexOf('<a');
          const lastCloseTag = textBeforeMatch.lastIndexOf('</a>');
          
          // If we're inside an <a> tag, don't replace
          if (lastOpenTag > lastCloseTag) {
            return match;
          }
          
          return `<a href="/${locale}${link}" style="color: var(--primary-color); text-decoration: underline;">${match}</a>`;
        });
      });
      
      parts[index] = processedPart;
      accumulatedText += processedPart;
    } else {
      // For HTML tags, just accumulate
      accumulatedText += part;
    }
  });
  
  return parts.join('');
}

// Valid article slugs
const VALID_SLUGS = [
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
  'article-what-is-spermmaxxing-2026',
  'article-sperm-health-biomarker-2026',
  'article-male-fertility-crisis-2026'
];

/**
 * 生成静态参数 - 为静态导出生成所有语言和所有 slug 的组合
 * 这是静态导出模式下动态路由的必需函数
 */
export function generateStaticParams() {
  const params: Array<{locale: string; slug: string}> = [];
  
  // 为每种语言和每个 slug 生成参数组合
  for (const locale of routing.locales) {
    for (const slug of VALID_SLUGS) {
      params.push({locale, slug});
    }
  }
  
  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'Article | iSperm Medical',
        description: 'FAQ article from iSperm Medical.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
      return {
        title: 'Article | iSperm Medical',
        description: 'FAQ article from iSperm Medical.',
      };
    }
    const {locale, slug} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'faq'});

  // Validate slug - if invalid, trigger 404
  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  // Get English translations for fallback (always needed)
  const tEn = await getTranslations({locale: 'en', namespace: 'faq'});

  // Get article info from JSON using unified path structure
  // Try current locale first, fallback to English
  let title = t(`articles.${slug}.title`, {default: null});
  let subtitle = t(`articles.${slug}.subtitle`, {default: null});
  let metaDescription = t(`articles.${slug}.metaDescription`, {default: null});
  
  // If not found or is a key path, try English
  if (isInvalidTranslationKey(title, 'title', slug)) {
    title = tEn(`articles.${slug}.title`, {default: null});
  }
  
  if (isInvalidTranslationKey(subtitle, 'subtitle', slug)) {
    subtitle = tEn(`articles.${slug}.subtitle`, {default: null});
  }

  if (isInvalidTranslationKey(metaDescription, 'metaDescription', slug)) {
    metaDescription = tEn(`articles.${slug}.metaDescription`, {default: null});
  }
  
  // If article doesn't exist in JSON, trigger 404
  if (isInvalidTranslationKey(title, 'title', slug) || isInvalidTranslationKey(subtitle, 'subtitle', slug)) {
    notFound();
  }

    return {
      title: `${title} | ${t('meta.title', {default: 'Knowledge Hub | CASA System FAQs | iSperm Medical'})}`,
      description: !isInvalidTranslationKey(metaDescription, 'metaDescription', slug) ? metaDescription : subtitle,
      alternates: generateHreflangAlternates(`/faq/${slug}`, locale),
    };
  } catch (error) {
    console.error('Error in faq/[slug] generateMetadata:', error);
    return {
      title: 'Article | iSperm Medical',
      description: 'FAQ article from iSperm Medical.',
    };
  }
}

// Helper function to check if a value is an invalid translation key path
function isInvalidTranslationKey(value: string | null | undefined, key: string, slug: string): boolean {
  if (!value) return true;
  return value.startsWith('articles.') || 
         value.startsWith('faq.articles.') ||
         value === `articles.${slug}.${key}` ||
         value === `faq.articles.${slug}.${key}`;
}

type FaqMessages = {
  articles?: Record<
    string,
    {conclusion?: string; references?: string[]}
  >;
};

function getArticleField(
  messages: FaqMessages | undefined,
  slug: string,
  field: 'conclusion' | 'references'
): string | string[] | null {
  const article = messages?.articles?.[slug];
  if (!article) return null;
  const value = article[field];
  if (field === 'conclusion') {
    return typeof value === 'string' && value.trim() ? value : null;
  }
  if (!Array.isArray(value) || value.length === 0) return null;
  return value.every((item) => typeof item === 'string') ? value : null;
}

export default async function FAQArticlePage({
  params
}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in FAQArticlePage');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale || !resolvedParams.slug) {
      throw new Error('Resolved params is invalid in FAQArticlePage');
    }
    const {locale, slug} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'faq'});
    const allMessages = (await getMessages({locale})) as {faq?: FaqMessages};
    const allMessagesEn = (await getMessages({locale: 'en'})) as {faq?: FaqMessages};
    const faqMessages = allMessages.faq;
    const faqMessagesEn = allMessagesEn.faq;

  // Validate slug - if invalid, trigger 404
  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  // Get English translations for fallback (always needed)
  const tEn = await getTranslations({locale: 'en', namespace: 'faq'});

  // Get article info from JSON using unified path structure
  // Try current locale first, fallback to English
  let title = t(`articles.${slug}.title`, {default: null});
  let subtitle = t(`articles.${slug}.subtitle`, {default: null});
  
  // If not found or is a key path, try English
  if (isInvalidTranslationKey(title, 'title', slug)) {
    title = tEn(`articles.${slug}.title`, {default: null});
  }
  
  if (isInvalidTranslationKey(subtitle, 'subtitle', slug)) {
    subtitle = tEn(`articles.${slug}.subtitle`, {default: null});
  }
  
  // If article doesn't exist in JSON, trigger 404
  if (isInvalidTranslationKey(title, 'title', slug) || isInvalidTranslationKey(subtitle, 'subtitle', slug)) {
    notFound();
  }

  const article = {
    title,
    subtitle
  };

  // Get article data for structured data (use same values)
  const articleTitle = title;
  const articleSubtitle = subtitle;
  
  // Get article content from JSON using unified path structure
  // Try to get intro from current locale, fallback to English
  // Use t.raw() to get raw HTML string without parsing formatting variables
  let intro = t.raw(`articles.${slug}.intro`) as string | null;
  
  // If intro not found or is a key path, try English
  if (!intro || isInvalidTranslationKey(intro, 'intro', slug)) {
    intro = tEn.raw(`articles.${slug}.intro`) as string | null;
  }
  
  // If intro still doesn't exist, trigger 404
  if (isInvalidTranslationKey(intro, 'intro', slug)) {
    notFound();
  }

  // Render article content from JSON
  // Try to get chapters from current locale, fallback to English
  let chapters = t.raw(`articles.${slug}.chapters`) as Array<{
    title: string;
    content?: string;
    subsections?: Array<{
      title: string;
      content?: string;
      lists?: Array<{
        type: string;
        items: Array<{label?: string; text: string}>;
      }>;
    }>;
    lists?: Array<{
      type: string;
      items: Array<{label?: string; text: string}>;
    }>;
    table?: {
      headers: string[];
      rows: string[][];
    };
  }> | null;
  
  // If chapters not found in current locale, try English (tEn already defined above)
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    chapters = tEn.raw(`articles.${slug}.chapters`) as typeof chapters;
  }
  
  // Check if last chapter is "Conclusion" (for new articles structure)
  let conclusion: string | null = null;
  let conclusionChapterIndex: number | null = null;
  
  if (chapters && chapters.length > 0) {
    const lastChapter = chapters[chapters.length - 1];
    if (lastChapter.title === 'Conclusion' || lastChapter.title.toLowerCase().includes('conclusion')) {
      conclusion = lastChapter.content || null;
      conclusionChapterIndex = chapters.length - 1;
    }
  }
  
  // If no conclusion in chapters, try separate conclusion field (optional on some articles)
  if (!conclusion) {
    const standaloneConclusion =
      getArticleField(faqMessages, slug, 'conclusion') ??
      getArticleField(faqMessagesEn, slug, 'conclusion');
    conclusion =
      typeof standaloneConclusion === 'string' ? standaloneConclusion : null;
  }

  // References are optional (2026 hub articles omit this field)
  const referencesField =
    getArticleField(faqMessages, slug, 'references') ??
    getArticleField(faqMessagesEn, slug, 'references');
  const references = Array.isArray(referencesField) ? referencesField : null;
  
  // Build canonical URL for structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.isperm.com';
  const articleUrl = `${baseUrl}/${locale}/faq/${slug}`;
  const breadcrumbUrl = `${baseUrl}/${locale}`;
  const knowledgeHubUrl = `${baseUrl}/${locale}/faq`;

  // Generate Article Schema JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleTitle,
    "description": articleSubtitle,
    "author": {
      "@type": "Organization",
      "name": "iSperm Medical Expert Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "iSperm Medical",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/iSperm%20LOGO.svg`
      }
    },
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl
  };

  // Generate BreadcrumbList Schema JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('nav.home'),
        "item": breadcrumbUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": t('nav.knowledgeHub'),
        "item": knowledgeHubUrl
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": articleTitle,
        "item": articleUrl
      }
    ]
  };

  return (
    <div>
      {/* Structured Data - Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Structured Data - BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Article Header */}
      <section className="hero" style={{minHeight: '40vh'}}>
        <div className="hero-background" style={{
          backgroundImage: `url('/banner (2).webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2
        }}></div>
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
          zIndex: -1
        }}></div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{article.title}</h1>
            <p className="hero-subtitle">{article.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <section style={{paddingTop: '40px', background: 'var(--light-color)'}}>
        <div className="container">
          <nav style={{marginBottom: '2rem'}} aria-label="Breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            <ol style={{display: 'flex', listStyle: 'none', gap: '0.5rem', flexWrap: 'wrap', padding: 0, margin: 0}}>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'none'}} itemProp="item">
                  <span itemProp="name">{t('nav.home')}</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li style={{color: 'var(--text-light)'}}> &gt; </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/faq" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'none'}} itemProp="item">
                  <span itemProp="name">{t('nav.knowledgeHub')}</span>
                </Link>
                <meta itemProp="position" content="2" />
              </li>
              <li style={{color: 'var(--text-light)'}}> &gt; </li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" style={{color: 'var(--text-light)'}}>
                <span itemProp="name">{article.title}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Article Content */}
      <section className="about-section" style={{padding: '40px 0'}}>
        <div className="container">
          <article style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: 'var(--white)',
            padding: '3rem',
            borderRadius: '12px',
            boxShadow: 'var(--shadow)'
          }}>
            <h2 style={{
              marginBottom: '1.5rem',
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              hyphens: locale === 'ar' ? 'none' : 'auto',
              fontSize: '2rem',
              fontWeight: 600,
              color: 'var(--text-color)'
            }}>{article.title}: {article.subtitle}</h2>
            
            {(() => {
                try {
                return (
                  <>
                    {/* Introduction */}
                    {intro && (
                      <p 
                        style={{
                          marginTop: '1.5rem', 
                          color: 'var(--text-light)', 
                          fontSize: '1.1rem', 
                          lineHeight: 1.8,
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: locale === 'ar' ? 'none' : 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: processContentWithInternalLinks(intro, locale) }}
                      />
                    )}

                    {/* Chapters */}
                    {chapters && chapters.map((chapter, chapterIndex) => {
                      // Skip conclusion chapter if it's being displayed separately
                      if (conclusionChapterIndex !== null && chapterIndex === conclusionChapterIndex) {
                        return null;
                      }
                      
                      return (
                      <div key={chapterIndex}>
                        <h2 style={{
                          marginTop: '2rem', 
                          marginBottom: '1rem', 
                          fontSize: '1.5rem', 
                          fontWeight: 600,
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: 'auto'
                        }}>
                          {chapter.title}
                        </h2>
                        
                        {chapter.content && (
                          <div 
                            style={{
                              marginBottom: '1rem', 
                              lineHeight: 1.8, 
                              color: 'var(--text-color)',
                              overflowWrap: 'break-word',
                              wordWrap: 'break-word',
                              wordBreak: 'break-word',
                              hyphens: locale === 'ar' ? 'none' : 'auto'
                            }}
                            dangerouslySetInnerHTML={{ __html: processContentWithInternalLinks(chapter.content, locale) }}
                          />
                        )}

                        {/* Subsections */}
                        {chapter.subsections && chapter.subsections.map((subsection, subIndex) => (
                          <div key={subIndex}>
                            <h3 style={{
                              marginTop: '1.5rem', 
                              marginBottom: '0.75rem', 
                              fontSize: '1.3rem', 
                              fontWeight: 600,
                              overflowWrap: 'break-word',
                              wordWrap: 'break-word',
                              wordBreak: 'break-word',
                              hyphens: locale === 'ar' ? 'none' : 'auto'
                            }}>
                              {subsection.title}
                            </h3>
                            
                            {subsection.content && (
                              <div 
                                style={{
                                  marginBottom: '1rem', 
                                  lineHeight: 1.8, 
                                  color: 'var(--text-color)',
                                  overflowWrap: 'break-word',
                                  wordWrap: 'break-word',
                                  wordBreak: 'break-word',
                                  hyphens: locale === 'ar' ? 'none' : 'auto'
                                }}
                                dangerouslySetInnerHTML={{ __html: processContentWithInternalLinks(subsection.content, locale) }}
                              />
                            )}

                            {/* Subsection Lists */}
                            {subsection.lists && subsection.lists.map((list, listIndex) => (
                              <ul key={listIndex} style={{
                                marginBottom: '2rem', 
                                paddingLeft: '1.5rem', 
                                lineHeight: 1.8, 
                                color: 'var(--text-color)',
                                overflowWrap: 'break-word',
                                wordWrap: 'break-word',
                                wordBreak: 'break-word',
                                hyphens: locale === 'ar' ? 'none' : 'auto'
                              }}>
                                {list.items.map((item, itemIndex) => {
                                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                                  let text = item.text;
                                  // Handle 37°C link first
                                  if (text.includes('37°C')) {
                                    const parts = text.split('37°C');
                                    return (
                                      <li key={itemIndex} style={{marginBottom: '0.5rem'}}>
                                        {item.label && <strong>{item.label} </strong>}
                                        {parts[0]}
                                        <Link href="/products" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>37°C</Link>
                                        {parts[1] && (() => {
                                          const urlParts = parts[1].split(urlRegex);
                                          return urlParts.map((part, partIndex) => {
                                            if (urlRegex.test(part)) {
                                              return (
                                                <a 
                                                  key={partIndex}
                                                  href={part} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  style={{color: 'var(--primary-color)', textDecoration: 'underline'}}
                                                >
                                                  {part}
                                                </a>
                                              );
                                            }
                                            return <span key={partIndex}>{part}</span>;
                                          });
                                        })()}
                                      </li>
                                    );
                                  }
                                  // Handle URLs in text
                                  const parts = text.split(urlRegex);
                                  return (
                                    <li key={itemIndex} style={{marginBottom: '0.5rem'}}>
                                      {item.label && <strong>{item.label} </strong>}
                                      {parts.map((part, partIndex) => {
                                        if (urlRegex.test(part)) {
                                          return (
                                            <a 
                                              key={partIndex}
                                              href={part} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              style={{color: 'var(--primary-color)', textDecoration: 'underline'}}
                                            >
                                              {part}
                                            </a>
                                          );
                                        }
                                        return <span key={partIndex}>{part}</span>;
                                      })}
                                    </li>
                                  );
                                })}
                              </ul>
                            ))}
                          </div>
                        ))}

                        {/* Chapter Lists */}
                            {chapter.lists && chapter.lists.map((list, listIndex) => (
                          <ul key={listIndex} style={{
                            marginBottom: '2rem', 
                            paddingLeft: '1.5rem', 
                            lineHeight: 1.8, 
                            color: 'var(--text-color)',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            hyphens: locale === 'ar' ? 'none' : 'auto'
                          }}>
                            {list.items.map((item, itemIndex) => {
                              const urlRegex = /(https?:\/\/[^\s]+)/g;
                              const parts = item.text.split(urlRegex);
                              return (
                                <li key={itemIndex} style={{marginBottom: '0.5rem'}}>
                                  {item.label && <strong>{item.label} </strong>}
                                  {parts.map((part, partIndex) => {
                                    if (urlRegex.test(part)) {
                                      return (
                                        <a 
                                          key={partIndex}
                                          href={part} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          style={{color: 'var(--primary-color)', textDecoration: 'underline'}}
                                        >
                                          {part}
                                        </a>
                                      );
                                    }
                                    return <span key={partIndex}>{part}</span>;
                                  })}
                                </li>
                              );
                            })}
                          </ul>
                        ))}

                        {/* Table */}
                        {chapter.table && (
                          <div style={{
                            overflowX: 'auto', 
                            margin: '1.5rem 0',
                            WebkitOverflowScrolling: 'touch'
                          }}>
                            <table style={{
                              width: '100%', 
                              borderCollapse: 'collapse',
                              tableLayout: 'auto',
                              minWidth: '100%',
                              display: 'table'
                            }}>
                              <thead>
                                <tr style={{background: 'var(--light-color)'}}>
                                  {chapter.table.headers.map((header, hIndex) => (
                                    <th key={hIndex} style={{
                                      padding: '0.75rem', 
                                      textAlign: 'left', 
                                      border: '1px solid #ddd',
                                      overflowWrap: 'break-word',
                                      wordWrap: 'break-word',
                                      wordBreak: 'break-word',
                                      hyphens: locale === 'ar' ? 'none' : 'auto'
                                    }}>
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {chapter.table.rows.map((row, rIndex) => (
                                  <tr key={rIndex}>
                                    {row.map((cell, cIndex) => (
                                      <td key={cIndex} style={{
                                        padding: '0.75rem', 
                                        border: '1px solid #ddd',
                                        overflowWrap: 'break-word',
                                        wordWrap: 'break-word',
                                        wordBreak: 'break-word',
                                        hyphens: locale === 'ar' ? 'none' : 'auto'
                                      }}>
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      );
                    })}

                    {/* Conclusion */}
                    {conclusion && (
                      <>
                        <h2 style={{
                          marginTop: '2rem', 
                          marginBottom: '1rem', 
                          fontSize: '1.5rem', 
                          fontWeight: 600,
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: locale === 'ar' ? 'none' : 'auto'
                        }}>
                          {t('ui.conclusion.title', {default: 'Conclusion: The Path to Precision'})}
                        </h2>
                        <div 
                          style={{
                            marginBottom: '2rem', 
                            lineHeight: 1.8, 
                            color: 'var(--text-color)',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            hyphens: locale === 'ar' ? 'none' : 'auto'
                          }}
                          dangerouslySetInnerHTML={{ __html: processContentWithInternalLinks(conclusion!, locale) }}
                        />
                      </>
                    )}

                    {/* References */}
                    {Array.isArray(references) && references.length > 0 && (
                      <>
                        <h2 style={{
                          marginTop: '2rem', 
                          marginBottom: '1rem', 
                          fontSize: '1.5rem', 
                          fontWeight: 600,
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: locale === 'ar' ? 'none' : 'auto'
                        }}>
                          {t('ui.references.title', {default: 'References & Technical Resources'})}
                        </h2>
                        <ul style={{
                          marginBottom: '2rem', 
                          paddingLeft: '1.5rem', 
                          lineHeight: 1.8, 
                          color: 'var(--text-color)',
                          overflowWrap: 'break-word',
                          wordWrap: 'break-word',
                          wordBreak: 'break-word',
                          hyphens: locale === 'ar' ? 'none' : 'auto'
                        }}>
                          {references.map((ref, refIndex) => {
                            // Convert URLs to clickable links
                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                            const parts = ref.split(urlRegex);
                            return (
                              <li key={refIndex} style={{marginBottom: '0.5rem'}}>
                                {parts.map((part, partIndex) => {
                                  if (urlRegex.test(part)) {
                                    return (
                                      <a 
                                        key={partIndex}
                                        href={part} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{color: 'var(--primary-color)', textDecoration: 'underline'}}
                                      >
                                        {part}
                                      </a>
                                    );
                                  }
                                  return <span key={partIndex}>{part}</span>;
                                })}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </>
                );
              } catch (error) {
                console.error('Error rendering article content:', error);
                throw error;
              }
            })()}
          </article>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
  } catch (error) {
    console.error('Error in FAQArticlePage:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
