import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'products'});

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: generateHreflangAlternates('/products'),
  };
}

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
