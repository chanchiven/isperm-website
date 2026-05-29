import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {buildPageMetadata} from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return buildPageMetadata({
        locale: 'en',
        path: '/search',
        title: 'Search | iSperm Medical',
        description: 'Search CASA systems and semen analyzers.',
        robots: {index: false, follow: true},
        includeHreflang: false,
      });
    }
    const resolvedParams = await params;
    if (!resolvedParams?.locale) {
      return buildPageMetadata({
        locale: 'en',
        path: '/search',
        title: 'Search | iSperm Medical',
        description: 'Search CASA systems and semen analyzers.',
        robots: {index: false, follow: true},
        includeHreflang: false,
      });
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'search'});

    return buildPageMetadata({
      locale,
      path: '/search',
      title: t('meta.title'),
      description: t('meta.description'),
      robots: {index: false, follow: true},
      includeHreflang: false,
    });
  } catch (error) {
    console.error('Error in search generateMetadata:', error);
    return buildPageMetadata({
      locale: 'en',
      path: '/search',
      title: 'Search | iSperm Medical',
      description: 'Search CASA systems and semen analyzers.',
      robots: {index: false, follow: true},
      includeHreflang: false,
    });
  }
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
