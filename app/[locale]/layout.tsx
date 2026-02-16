import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import {HtmlLangDir} from '@/components/HtmlLangDir';
import {generateHreflangAlternates} from '@/i18n/hreflang';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    // 防御性检查：确保 params 存在
    if (!params) {
      console.error('Params is undefined in generateMetadata');
      return {
        title: 'iSperm Medical',
        description: 'CASA systems and semen analyzers',
      };
    }
    
    const resolvedParams = await params;
    
    // 防御性检查：确保 resolvedParams 存在且有 locale 属性
    if (!resolvedParams || !resolvedParams.locale) {
      console.error('Resolved params is invalid in generateMetadata:', resolvedParams);
      return {
        title: 'iSperm Medical',
        description: 'CASA systems and semen analyzers',
      };
    }
    
    const {locale} = resolvedParams;
    
    // 验证路径中的 locale 是否合法
    if (!routing.locales.includes(locale as any)) {
      notFound();
    }
    
    try {
      const t = await getTranslations({locale, namespace: 'index'});
      
      // 为首页生成 hreflang 链接
      // 注意：layout.tsx 中的 hreflang 只适用于首页
      // 其他页面需要在各自的 generateMetadata 中添加 hreflang
      const alternates = generateHreflangAlternates('/', locale);
      
      const title = t('meta.title');
      const description = t('meta.description');
      const baseUrl = 'https://www.isperm.com';
      const pageUrl = `${baseUrl}/${locale}`;

      return {
        title,
        description,
        alternates: alternates,
        openGraph: {
          title,
          description,
          url: pageUrl,
          siteName: 'iSperm Medical',
          images: [{ url: `${baseUrl}/banner%20(1).webp`, width: 1200, height: 630, alt: t('hero.bannerAlt') }],
          locale: locale.replace('-', '_'),
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        },
      };
    } catch (error) {
      // 如果翻译加载失败，使用默认值
      console.error(`Failed to load translations for metadata (locale: ${locale}):`, error);
      return {
        title: 'CASA System & Sperm Analyzer | iSperm Medical',
        description: 'Fully automated CASA systems & sperm morphology analyzers for human & veterinary use.',
      };
    }
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'iSperm Medical',
      description: 'CASA systems and semen analyzers',
    };
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>; // 注意：Next.js 15 中 params 是 Promise
}) {
  try {
    // 防御性检查：确保 params 存在
    if (!params) {
      console.error('Params is undefined in LocaleLayout');
      // 使用默认语言
      const defaultMessages = await getMessages({locale: routing.defaultLocale});
      return (
        <NextIntlClientProvider messages={defaultMessages} locale={routing.defaultLocale}>
          <HtmlLangDir />
          {children}
        </NextIntlClientProvider>
      );
    }
    
    const resolvedParams = await params;
    
    // 防御性检查：确保 resolvedParams 存在且有 locale 属性
    if (!resolvedParams || !resolvedParams.locale) {
      console.error('Resolved params is invalid in LocaleLayout:', resolvedParams);
      // 使用默认语言
      const defaultMessages = await getMessages({locale: routing.defaultLocale});
      return (
        <NextIntlClientProvider messages={defaultMessages} locale={routing.defaultLocale}>
          <HtmlLangDir />
          {children}
        </NextIntlClientProvider>
      );
    }
    
    const {locale} = resolvedParams;

    // 验证路径中的 locale 是否合法
    if (!routing.locales.includes(locale as any)) {
      notFound();
    }

    // 获取该语言对应的翻译词条
    // 显式传递 locale 确保加载正确的翻译文件
    let messages = {};
    try {
      messages = await getMessages({locale});
    } catch (error) {
      console.error(`Failed to load messages for locale ${locale}:`, error);
      // 如果加载失败，尝试加载英文作为后备
      try {
        messages = await getMessages({locale: routing.defaultLocale});
      } catch (fallbackError) {
        console.error(`Failed to load fallback messages:`, fallbackError);
        // 返回空对象，让应用继续运行
        messages = {};
      }
    }

    return (
      <NextIntlClientProvider messages={messages} locale={locale}>
        <HtmlLangDir />
        {children}
      </NextIntlClientProvider>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    // 即使出错也返回基本结构，避免完全崩溃
    // 尝试使用默认语言
    try {
      const defaultMessages = await getMessages({locale: routing.defaultLocale});
      return (
        <NextIntlClientProvider messages={defaultMessages} locale={routing.defaultLocale}>
          <HtmlLangDir />
          {children}
        </NextIntlClientProvider>
      );
    } catch (fallbackError) {
      // 最后的后备方案：返回空消息对象
      return (
        <NextIntlClientProvider messages={{}} locale={routing.defaultLocale}>
          <HtmlLangDir />
          {children}
        </NextIntlClientProvider>
      );
    }
  }
}
