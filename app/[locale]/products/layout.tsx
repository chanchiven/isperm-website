import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'Products | iSperm Medical',
        description: 'CASA systems and semen analyzers from iSperm Medical.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'Products | iSperm Medical',
        description: 'CASA systems and semen analyzers from iSperm Medical.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'products'});

    return {
      title: t('meta.title'),
      description: t('meta.description'),
      alternates: generateHreflangAlternates('/products'),
    };
  } catch (error) {
    console.error('Error in products generateMetadata:', error);
    return {
      title: 'Products | iSperm Medical',
      description: 'CASA systems and semen analyzers from iSperm Medical.',
    };
  }
}

export default function ProductsLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
