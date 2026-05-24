import {Suspense} from 'react';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {SearchContent} from '@/components/SearchContent';
import {Loader2} from 'lucide-react';

export default async function SearchPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations({locale, namespace: 'search'});

  return (
    <div>
      <Navigation />

      <section className="hero" style={{minHeight: '40vh', position: 'relative'}}>
        <div
          className="hero-background"
          style={{
            backgroundImage: `url('/banner%20(1).webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2
          }}
        />
        <div
          className="hero-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
            zIndex: -1
          }}
        />
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="hero-content">
            <h1 className="hero-title">{t('pageTitle')}</h1>
          </div>
        </div>
      </section>

      <section className="about-section" style={{padding: '80px 0'}}>
        <div className="container">
          <Suspense
            fallback={
              <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
                <Loader2
                  size={48}
                  color="var(--primary-color)"
                  className="search-spinner"
                  style={{margin: '0 auto'}}
                />
                <p style={{marginTop: '1rem', color: 'var(--text-color-secondary)'}}>
                  {t('searching')}
                </p>
              </div>
            }
          >
            <SearchContent />
          </Suspense>
        </div>
      </section>


      <Footer locale={locale} />
    </div>
  );
}
