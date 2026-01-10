import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import Image from 'next/image';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'SQA-6100VET | iSperm Medical',
        description: 'Veterinary CASA system for animal semen analysis.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'SQA-6100VET | iSperm Medical',
        description: 'Veterinary CASA system for animal semen analysis.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'products'});

    return {
      title: t('products.sqavetMeta.title'),
      description: t('products.sqavetMeta.description'),
      alternates: generateHreflangAlternates('/products/sqa-6100vet'),
    };
  } catch (error) {
    console.error('Error in sqa-6100vet generateMetadata:', error);
    return {
      title: 'SQA-6100VET | iSperm Medical',
      description: 'Veterinary CASA system for animal semen analysis.',
    };
  }
}

export default async function SQA6100VetPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in SQA6100VetPage');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in SQA6100VetPage');
    }
    const {locale} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'products'});
  // Fallback to English if current locale doesn't have detail data
  const tEn = await getTranslations({locale: 'en', namespace: 'products'});
  
  // Helper function to get translation with fallback
  const getT = (key: string) => {
    // Get English translation (should always work since English JSON has complete data)
    const enValue = tEn(key);
    
    // Check if English translation is valid (not a key path)
    // When using namespace, next-intl returns the full path when translation is missing
    const isEnValid = enValue && 
                      typeof enValue === 'string' && 
                      enValue !== key && 
                      !enValue.startsWith('products.');
    
    // If not English locale, try current locale first
    if (locale !== 'en') {
      const localeValue = t(key);
      const isLocaleValid = localeValue && 
                            typeof localeValue === 'string' && 
                            localeValue !== key && 
                            !localeValue.startsWith('products.');
      
      if (isLocaleValid) {
        return localeValue;
      }
    }
    
    // Use English as fallback
    if (isEnValid) {
      return enValue;
    }
    
    // If we get here, both translations failed - log error and return key
    console.error(`Translation failed for key: ${key}`, {
      locale,
      enValue,
      currentValue: locale !== 'en' ? t(key) : undefined
    });
    return key;
  };

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Product Header */}
      <section className="hero" style={{minHeight: '40vh'}}>
        <div className="hero-background" style={{
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
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{getT('products.sqavet.name')}</h1>
            <p className="hero-subtitle">{getT('products.sqavet.heroSubtitle')}</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section style={{paddingTop: '40px', background: 'var(--light-color)'}}>
        <div className="container">
          <nav style={{marginBottom: '2rem'}} aria-label="Breadcrumb">
            <ol style={{display: 'flex', listStyle: 'none', gap: '0.5rem', flexWrap: 'wrap'}}>
              <li><Link href="/" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'none'}}>{t('nav.home')}</Link></li>
              <li style={{color: 'var(--text-light)'}}>&gt;</li>
              <li><Link href="/products" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'none'}}>{t('nav.products')}</Link></li>
              <li style={{color: 'var(--text-light)'}}>&gt;</li>
              <li style={{color: 'var(--text-light)'}}>{getT('products.sqavet.name')}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="products-detail">
        <div className="container">
          <div className="product-detail-content">
            <div className="product-detail-text">
              <h2>{getT('products.sqavet.name')}</h2>
              <p className="product-subtitle">{getT('products.sqavet.subtitle')}</p>
              <p>{getT('products.sqavet.detail.description')}</p>
              
              <h3>{getT('products.sqavet.detail.keyFeatures.title')}</h3>
              <ul className="product-features-list">
                {(() => {
                  let items = t.raw('products.sqavet.detail.keyFeatures.items') as string[] | undefined;
                  if (!items || !Array.isArray(items)) {
                    items = tEn.raw('products.sqavet.detail.keyFeatures.items') as string[] | undefined;
                  }
                  if (!items || !Array.isArray(items)) return null;
                  return items.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ));
                })()}
              </ul>

              <h3>{getT('products.sqavet.detail.analysisParameters.title')}</h3>
              <div className="parameters-grid">
                {(() => {
                  let groups = t.raw('products.sqavet.detail.analysisParameters.groups') as Array<{title: string; items: string[]}> | undefined;
                  if (!groups || !Array.isArray(groups)) {
                    groups = tEn.raw('products.sqavet.detail.analysisParameters.groups') as Array<{title: string; items: string[]}> | undefined;
                  }
                  if (!groups || !Array.isArray(groups)) return null;
                  return groups.map((group, groupIndex) => (
                    <div key={groupIndex} className="parameter-group">
                      <h4>{group.title}</h4>
                      <ul>
                        {group.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            </div>
            <div className="product-detail-image">
              <div className="product-images-list product-images-grid-2x2" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                padding: '2rem'
              }}>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/sqa-6100vet-1.webp" 
                    alt={`${getT('products.sqavet.name')} multi-species CASA system for professional bull breeding soundness examination with built-in heating stage and automated sperm analysis`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 50vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/sqa-6100vet-2.webp" 
                    alt={`${getT('products.sqavet.name')} portable veterinary CASA analyzer for field breeding soundness evaluation with all-in-one design and touch screen interface`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 50vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/sqa-6100vet-3.webp" 
                    alt={`${getT('products.sqavet.name')} CASA system touch screen interface displaying automated sperm motility and morphology analysis results for multi-species veterinary assessment`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 50vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/sqa-6100vet-4.webp" 
                    alt={`${getT('products.sqavet.name')} veterinary CASA system with advanced imaging capabilities and multi-species semen analysis features`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thermal Integrity Advantage Section */}
      <section className="products-detail thermal-integrity-section" style={{padding: '80px 0'}}>
        <div className="container">
          <div className="section-header">
            <h2>{getT('products.sqavet.detail.thermalIntegrity.title')}</h2>
            <p>{getT('products.sqavet.detail.thermalIntegrity.subtitle')}</p>
          </div>
          <div style={{maxWidth: '900px', margin: '0 auto'}}>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '2rem'}}>
              {getT('products.sqavet.detail.thermalIntegrity.intro')}
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem'}}>
              <div style={{background: 'var(--light-color)', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid var(--primary-color)'}}>
                <h4 style={{color: 'var(--dark-color)', marginBottom: '1rem', fontSize: '1.2rem'}}>{getT('products.sqavet.detail.thermalIntegrity.challenge.title')}</h4>
                <p style={{color: 'var(--text-color)', lineHeight: '1.7'}}>
                  {getT('products.sqavet.detail.thermalIntegrity.challenge.text')}
                </p>
              </div>
              <div style={{background: 'var(--light-color)', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid var(--secondary-color)'}}>
                <h4 style={{color: 'var(--dark-color)', marginBottom: '1rem', fontSize: '1.2rem'}}>{getT('products.sqavet.detail.thermalIntegrity.solution.title')}</h4>
                <p style={{color: 'var(--text-color)', lineHeight: '1.7'}}>
                  {getT('products.sqavet.detail.thermalIntegrity.solution.text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Standards Compliance Section */}
      <section className="products-detail" style={{background: 'var(--light-color)', padding: '80px 0'}}>
        <div className="container">
          <div className="synergy-module">
            <h3>{getT('products.sqavet.detail.scientificStandards.title')}</h3>
            <p style={{fontSize: '1.1rem', lineHeight: '1.8'}}>
              {getT('products.sqavet.detail.scientificStandards.description')}
            </p>
            <div className="synergy-standards">
              {(() => {
                let standards = t.raw('products.sqavet.detail.scientificStandards.standards') as Array<{title: string; text: string}> | undefined;
                if (!standards || !Array.isArray(standards)) {
                  standards = tEn.raw('products.sqavet.detail.scientificStandards.standards') as Array<{title: string; text: string}> | undefined;
                }
                if (!standards || !Array.isArray(standards)) return null;
                return standards.map((standard, index) => (
                  <div key={index} className="synergy-standard-item">
                    <h4>{standard.title}</h4>
                    <p>{standard.text}</p>
                  </div>
                ));
              })()}
            </div>
            <div style={{marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(0, 119, 182, 0.15)'}}>
              <p style={{color: 'var(--text-light)', fontSize: '0.95rem', marginBottom: '1rem'}}>
                <strong>{getT('products.sqavet.detail.scientificStandards.footer')}</strong> <Link href="/faq" locale={locale as any} style={{color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600}}>{t('nav.knowledgeHub')}</Link>
              </p>
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
    console.error('Error in SQA6100VetPage:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
