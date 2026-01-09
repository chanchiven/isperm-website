import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    // 防御性检查：确保 params 存在
    if (!params) {
      console.error('Params is undefined in contact generateMetadata');
      return {
        title: 'Contact Us | iSperm Medical',
        description: 'Get in touch with iSperm Medical for CASA systems and semen analyzers.',
      };
    }
    
    const resolvedParams = await params;
    
    // 防御性检查：确保 resolvedParams 存在且有 locale 属性
    if (!resolvedParams || !resolvedParams.locale) {
      console.error('Resolved params is invalid in contact generateMetadata:', resolvedParams);
      return {
        title: 'Contact Us | iSperm Medical',
        description: 'Get in touch with iSperm Medical for CASA systems and semen analyzers.',
      };
    }
    
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'contact'});

    return {
      title: t('meta.title'),
      description: t('meta.description'),
      alternates: generateHreflangAlternates('/contact'),
    };
  } catch (error) {
    console.error('Error in contact generateMetadata:', error);
    return {
      title: 'Contact Us | iSperm Medical',
      description: 'Get in touch with iSperm Medical for CASA systems and semen analyzers.',
    };
  }
}

export default function ContactLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
