import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {buildPageMetadata, buildPageUrl} from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params?: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    let locale = 'en';
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams?.locale) {
        locale = resolvedParams.locale;
      }
    }
    const t = await getTranslations({locale, namespace: 'index'});
    const title = t('notFound.title');
    const description = t('notFound.description');

    return {
      ...buildPageMetadata({
        locale,
        path: '/',
        title,
        description,
        includeHreflang: false,
      }),
      robots: {index: false, follow: true},
      alternates: {
        canonical: buildPageUrl(locale, '/'),
      },
    };
  } catch (error) {
    console.error('Error in not-found generateMetadata:', error);
    return {
      title: '404 - Page Not Found | iSperm Medical',
      description: 'The page you are looking for does not exist.',
      robots: {index: false, follow: true},
    };
  }
}

export default async function NotFoundPage({
  params,
}: {
  params?: Promise<{locale: string}>;
}) {
  try {
    let locale = 'en';
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams?.locale) {
        locale = resolvedParams.locale;
      }
    }
    const t = await getTranslations({locale, namespace: 'index'});

    return (
      <div>
        <Navigation />

        <section
          style={{
            padding: '120px 0',
            background: 'var(--light-color)',
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="container" style={{textAlign: 'center'}}>
            <div
              style={{
                fontSize: '8rem',
                fontWeight: 700,
                color: 'var(--primary-color)',
                marginBottom: '1rem',
                lineHeight: 1,
              }}
              aria-hidden="true"
            >
              {t('notFound.statusCode')}
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                fontWeight: 600,
                color: 'var(--dark-color)',
                marginBottom: '1.5rem',
                lineHeight: 1.3,
              }}
            >
              {t('notFound.title')}
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--text-light)',
                marginBottom: '3rem',
                maxWidth: '600px',
                margin: '0 auto 3rem',
                lineHeight: 1.6,
              }}
            >
              {t('notFound.description')}
            </p>

            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              <Link
                href="/"
                locale={locale as any}
                className="btn btn-primary"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                {t('notFound.backToHome')}
              </Link>

              <Link
                href="/products"
                locale={locale as any}
                className="btn btn-outline"
                style={{
                  padding: '14px 32px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                }}
              >
                {t('nav.products')}
              </Link>
            </div>
          </div>
        </section>

        <Footer locale={locale} />
      </div>
    );
  } catch (error) {
    console.error('Error in NotFoundPage:', error);
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
