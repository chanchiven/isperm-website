import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'About Us | iSperm Medical',
        description: 'Learn about iSperm Medical and our CASA systems.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'About Us | iSperm Medical',
        description: 'Learn about iSperm Medical and our CASA systems.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'about'});

    return {
      title: t('meta.title'),
      description: t('meta.description'),
      alternates: generateHreflangAlternates('/about'),
    };
  } catch (error) {
    console.error('Error in about generateMetadata:', error);
    return {
      title: 'About Us | iSperm Medical',
      description: 'Learn about iSperm Medical and our CASA systems.',
    };
  }
}

export default async function AboutPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in AboutPage');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in AboutPage');
    }
    const {locale} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'about'});

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Who We Are - Hero Section */}
      <section className="hero" style={{minHeight: '60vh', position: 'relative'}}>
        <div className="hero-background" style={{
          backgroundImage: `url('/banner%20(2).webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2
        }}></div>
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
          zIndex: -1
        }}></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="hero-content">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* About Description Section */}
      <section className="about-description-section" style={{padding: '80px 0', background: 'var(--white)'}}>
        <div className="container">
          <div style={{maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '0 1rem'}}>
            <p style={{fontSize: '1.2rem', color: 'var(--text-color)', lineHeight: '1.8', margin: 0}}>
              {t('description.text')}
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('founder.title')}</h2>
          </div>
          <div className="founder-content">
            <div className="founder-image">
              <img src="/Zhuang Bin.jpg" alt={`${t('founder.name')} - ${t('founder.title')} at iSperm Medical, inventor of cell-level microfluidic chips for CASA systems`} loading="lazy" decoding="async" />
            </div>
            <div className="founder-info">
              <h3>{t('founder.name')}</h3>
              
              <div className="info-section">
                <h4>{t('founder.education.title')}</h4>
                <ul>
                  <li>{t('founder.education.item1')}</li>
                  <li>{t('founder.education.item2')}</li>
                </ul>
              </div>

              <div className="info-section">
                <h4>{t('founder.career.title')}</h4>
                <ul>
                  <li>{t('founder.career.item1')}</li>
                  <li>{t('founder.career.item2')}</li>
                  <li>{t('founder.career.item3')}</li>
                </ul>
              </div>

              <div className="info-section">
                <h4>{t('founder.entrepreneurship.title')}</h4>
                <ul>
                  <li>{t('founder.entrepreneurship.item1')}</li>
                  <li>{t('founder.entrepreneurship.item2')}</li>
                  <li>{t('founder.entrepreneurship.item3')}</li>
                </ul>
              </div>

              <div className="info-section">
                <h4>{t('founder.achievements.title')}</h4>
                <ul>
                  <li>{t('founder.achievements.item1')}</li>
                  <li>{t('founder.achievements.item2')}</li>
                  <li>{t('founder.achievements.item3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Showcase Images */}
      <section className="showcase-section" style={{padding: '80px 0', background: 'var(--light-color)'}}>
        <div className="container">
          <div className="section-header">
            <h2>{t('showcase.title')}</h2>
            <p>{t('showcase.subtitle')}</p>
          </div>
          <div className="product-images-list showcase-images" style={{maxWidth: '1200px', margin: '0 auto'}}>
            <div className="product-image-item" style={{position: 'relative', minHeight: '300px'}}>
              <img src="/About%20us%20(1).webp" alt={t('showcase.images.image1.alt')} loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="product-image-item" style={{position: 'relative', minHeight: '300px'}}>
              <img src="/About%20us%20(2).webp" alt={t('showcase.images.image2.alt')} loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="product-image-item" style={{position: 'relative', minHeight: '300px'}}>
              <img src="/About%20Us%202.webp" alt={t('showcase.images.image3.alt')} loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="product-image-item" style={{position: 'relative', minHeight: '300px'}}>
              <img src="/About%20Us%204.webp" alt={t('showcase.images.image4.alt')} loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="product-image-item" style={{position: 'relative', minHeight: '300px'}}>
              <img src="/About%20Us%205.webp" alt={t('showcase.images.image5.alt')} loading="lazy" decoding="async" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{t('footer.company')}</h3>
              <p>{t('footer.description')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('footer.quickLinks')}</h4>
              <ul>
                <li><Link href="/" locale={locale as any}>{t('nav.home')}</Link></li>
                <li><Link href="/products" locale={locale as any}>{t('nav.products')}</Link></li>
                <li><Link href="/about" locale={locale as any}>{t('nav.about')}</Link></li>
                <li><Link href="/contact" locale={locale as any}>{t('nav.contact')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{t('footer.contact')}</h4>
              <p>{t('footer.email')} <a href="mailto:market@isperm.com">market@isperm.com</a></p>
              <p>{t('footer.address')} {t('footer.fullAddress')}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
  } catch (error) {
    console.error('Error in AboutPage:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}

