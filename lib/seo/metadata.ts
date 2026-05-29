import {Metadata} from 'next';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export const BASE_URL = 'https://www.isperm.com';
export const SITE_NAME = 'iSperm Medical';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/banner%20(1).webp`;
export const ARTICLE_TITLE_SUFFIX = `| ${SITE_NAME}`;

/** Build canonical page URL with trailing slash (matches next.config trailingSlash). */
export function buildPageUrl(locale: string, path: string = '/'): string {
  if (path === '/' || path === '') {
    return `${BASE_URL}/${locale}/`;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return `${BASE_URL}/${locale}${withSlash}`;
}

export function buildSocialMetadata(options: {
  locale: string;
  path: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}): Pick<Metadata, 'openGraph' | 'twitter'> {
  const {locale, path, title, description, imageUrl, imageAlt} = options;
  const url = buildPageUrl(locale, path);
  const image = imageUrl ?? DEFAULT_OG_IMAGE;

  return {
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale.replace('-', '_'),
      type: 'website',
      images: [
        {
          url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: imageAlt ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export function buildPageMetadata(options: {
  locale: string;
  path: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  robots?: Metadata['robots'];
  includeHreflang?: boolean;
}): Metadata {
  const {
    locale,
    path,
    title,
    description,
    imageUrl,
    imageAlt,
    robots,
    includeHreflang = true,
  } = options;

  const alternates = includeHreflang
    ? generateHreflangAlternates(path, locale)
    : {canonical: buildPageUrl(locale, path)};

  return {
    title,
    description,
    alternates,
    robots,
    ...buildSocialMetadata({locale, path, title, description, imageUrl, imageAlt}),
  };
}
