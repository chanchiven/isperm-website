import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import {routing} from '@/i18n/routing';
import {RootHeadScripts} from '@/components/RootHeadScripts';
import {buildPageMetadata} from '@/lib/seo/metadata';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'iSperm Medical',
        description: 'CASA systems and semen analyzers',
      };
    }

    const resolvedParams = await params;

    if (!resolvedParams?.locale) {
      return {
        title: 'iSperm Medical',
        description: 'CASA systems and semen analyzers',
      };
    }

    const {locale} = resolvedParams;

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
      notFound();
    }

    try {
      const t = await getTranslations({locale, namespace: 'index'});
      const title = t('meta.title');
      const description = t('meta.description');

      return buildPageMetadata({
        locale,
        path: '/',
        title,
        description,
        imageAlt: t('hero.bannerAlt'),
      });
    } catch (error) {
      console.error(`Failed to load translations for metadata (locale: ${locale}):`, error);
      return buildPageMetadata({
        locale,
        path: '/',
        title: 'CASA System & Sperm Analyzer | iSperm Medical',
        description:
          'Fully automated CASA systems & sperm morphology analyzers for human & veterinary use.',
      });
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
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const fallbackRender = async (locale: string) => {
    const messages = await getMessages({locale});
    return (
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <head>
          <RootHeadScripts />
        </head>
        <body>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    );
  };

  try {
    if (!params) {
      return fallbackRender(routing.defaultLocale);
    }

    const resolvedParams = await params;

    if (!resolvedParams?.locale) {
      return fallbackRender(routing.defaultLocale);
    }

    const {locale} = resolvedParams;

    if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
      notFound();
    }

    let messages = {};
    try {
      messages = await getMessages({locale});
    } catch (error) {
      console.error(`Failed to load messages for locale ${locale}:`, error);
      try {
        messages = await getMessages({locale: routing.defaultLocale});
      } catch (fallbackError) {
        console.error('Failed to load fallback messages:', fallbackError);
        messages = {};
      }
    }

    return (
      <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <head>
          <RootHeadScripts />
        </head>
        <body>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    try {
      return fallbackRender(routing.defaultLocale);
    } catch {
      return (
        <html lang={routing.defaultLocale}>
          <head>
            <RootHeadScripts />
          </head>
          <body>{children}</body>
        </html>
      );
    }
  }
}
