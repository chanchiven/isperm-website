/** Fallback ISO dates when `articles.{slug}.published` is absent in translations. */
const ARTICLE_PUBLISHED_FALLBACK: Record<string, string> = {
  'faq-human-semen-standards': '2024-06-01',
  'faq-bull-breeding-soundness': '2024-06-01',
  'faq-canine-semen-analysis': '2024-06-01',
  'faq-poultry-semen-analysis': '2024-06-01',
  'faq-stallion-semen-analysis': '2024-06-01',
  'faq-camelid-andrology': '2024-06-01',
  'faq-fish-semen-analysis': '2024-06-01',
  'faq-ram-breeding-soundness': '2024-06-01',
  'faq-boar-semen-evaluation': '2024-06-01',
  'who-6th-edition-semen-analysis-standards': '2025-01-01',
  'iso-23162-2021-laboratory-competence-guide': '2025-01-01',
  'eshre-guidelines-clinical-semen-examination': '2025-01-01',
  'asrm-male-infertility-evaluation-protocols': '2025-01-01',
  'article-what-is-spermmaxxing-2026': '2026-05-01',
  'article-sperm-health-biomarker-2026': '2026-05-01',
  'article-male-fertility-crisis-2026': '2026-05-01',
};

const MONTH_TO_NUM: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

/** Parse "May 2026", "2024-06-01", or "2024" into ISO date (YYYY-MM-DD). */
export function parsePublishedToIso(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01-01`;
  }
  const monthYear = trimmed.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTH_TO_NUM[monthYear[1].toLowerCase()];
    if (month) {
      return `${monthYear[2]}-${month}-01`;
    }
  }
  return trimmed;
}

export function isInvalidPublishedValue(
  value: string | null | undefined,
  slug: string
): boolean {
  if (!value) return true;
  return (
    value.startsWith('articles.') ||
    value === `articles.${slug}.published` ||
    value === `faq.articles.${slug}.published`
  );
}

export function getArticlePublishedIso(
  publishedFromTranslation: string | null | undefined,
  slug: string
): string {
  if (!isInvalidPublishedValue(publishedFromTranslation, slug) && publishedFromTranslation) {
    return parsePublishedToIso(publishedFromTranslation);
  }
  return ARTICLE_PUBLISHED_FALLBACK[slug] ?? '2024-01-01';
}
