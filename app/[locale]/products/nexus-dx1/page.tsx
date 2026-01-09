import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {HoverableDiv} from '@/components/HoverableDiv';
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
        title: 'Nexus Dx1 | iSperm Medical',
        description: 'Advanced CASA system for human semen analysis.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'Nexus Dx1 | iSperm Medical',
        description: 'Advanced CASA system for human semen analysis.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'products'});

    return {
      title: t('products.nexusMeta.title'),
      description: t('products.nexusMeta.description'),
      alternates: generateHreflangAlternates('/products/nexus-dx1'),
    };
  } catch (error) {
    console.error('Error in nexus-dx1 generateMetadata:', error);
    return {
      title: 'Nexus Dx1 | iSperm Medical',
      description: 'Advanced CASA system for human semen analysis.',
    };
  }
}

export default async function NexusDx1Page({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in NexusDx1Page');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in NexusDx1Page');
    }
    const {locale} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'products'});
  // Fallback to English if current locale doesn't have detail data
  const tEn = await getTranslations({locale: 'en', namespace: 'products'});
  // Get FAQ translations for compliance articles
  const tFaq = await getTranslations({locale, namespace: 'faq'});
  const tFaqEn = await getTranslations({locale: 'en', namespace: 'faq'});
  
  // Helper function to get translation with fallback
  const getT = (key: string, values?: Record<string, string>) => {
    // Get English translation (should always work since English JSON has complete data)
    const enValue = values ? tEn(key, values) : tEn(key);
    
    // Check if English translation is valid (not a key path)
    // When using namespace, next-intl returns the full path when translation is missing
    // Check for common patterns that indicate a failed translation:
    // 1. Value equals the key
    // 2. Value starts with 'products.' (indicates namespace prefix was added incorrectly)
    // 3. Value contains the key as a substring (but is a longer path, indicating failure)
    const isEnValid = enValue && 
                      typeof enValue === 'string' && 
                      enValue !== key &&
                      enValue.length > 0 &&
                      !enValue.startsWith('products.') &&
                      // Check if value looks like a key path (contains multiple dots and the key)
                      !(enValue.includes('.') && enValue.includes(key) && enValue.length > key.length + 5);
    
    // If not English locale, try current locale first
    if (locale !== 'en') {
      const localeValue = values ? t(key, values) : t(key);
      const isLocaleValid = localeValue && 
                            typeof localeValue === 'string' && 
                            localeValue !== key &&
                            localeValue.length > 0 &&
                            !localeValue.startsWith('products.') &&
                            !(localeValue.includes('.') && localeValue.includes(key) && localeValue.length > key.length + 5);
      
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
      enValueType: typeof enValue,
      enValueLength: enValue?.length,
      currentValue: locale !== 'en' ? (values ? t(key, values) : t(key)) : undefined
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
          backgroundImage: `url('/banner (2).webp')`,
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
            <h1 className="hero-title">{getT('products.nexus.name')}</h1>
            <p className="hero-subtitle">{getT('products.nexus.heroSubtitle')}</p>
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
              <li style={{color: 'var(--text-light)'}}>{getT('products.nexus.name')}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="products-detail" style={{background: 'var(--light-color)'}}>
        <div className="container">
          <div className="product-detail-content">
            <div className="product-detail-text">
              <h2>{getT('products.nexus.name')}</h2>
              <p className="product-subtitle">{getT('products.nexus.subtitle')}</p>
              <p>{getT('products.nexus.detail.description')}</p>
              
              <h3>{getT('products.nexus.detail.keyFeatures.title')}</h3>
              <ul className="product-features-list">
                {(() => {
                  let items = t.raw('products.nexus.detail.keyFeatures.items') as string[] | undefined;
                  if (!items || !Array.isArray(items)) {
                    items = tEn.raw('products.nexus.detail.keyFeatures.items') as string[] | undefined;
                  }
                  if (!items || !Array.isArray(items)) return null;
                  return items.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ));
                })()}
              </ul>

              <h3>{getT('products.nexus.detail.analysisParameters.title')}</h3>
              <div className="parameters-grid">
                {(() => {
                  let groups = t.raw('products.nexus.detail.analysisParameters.groups') as Array<{title: string; items: string[]}> | undefined;
                  if (!groups || !Array.isArray(groups)) {
                    groups = tEn.raw('products.nexus.detail.analysisParameters.groups') as Array<{title: string; items: string[]}> | undefined;
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
              <div className="product-images-list">
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '16/9'}}>
                  <Image 
                    src="/nexus-dx1.webp" 
                    alt={`${getT('products.nexus.name')} fully automated human CASA system for clinical semen analysis with built-in heating stage, WHO 6th Edition compliance, and advanced AI morphology analysis`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '16/9'}}>
                  <Image 
                    src="/nexus-dx1-2.webp" 
                    alt={`${getT('products.nexus.name')} professional CASA system with touch screen interface and advanced AI algorithms for comprehensive human semen analysis`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '16/9'}}>
                  <Image 
                    src="/nexus-dx1-3.webp" 
                    alt={`${getT('products.nexus.name')} integrated CASA workstation with built-in heating stage, automated analysis capabilities, and PC workstation support for clinical andrology applications`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Standards Section */}
      <section style={{padding: '60px 0', background: 'var(--white)'}}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            marginBottom: '3rem',
            fontSize: '2rem',
            fontWeight: 600,
            color: 'var(--text-color)'
          }}>
            {getT('products.nexus.detail.complianceStandards.title')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {(() => {
              // Get standards list from JSON with fallback
              let standards = t.raw('products.nexus.detail.complianceStandards.standards') as Array<{
                slug: string;
                name: string;
                title: string;
                description: string;
              }> | undefined;
              
              if (!standards || !Array.isArray(standards)) {
                standards = tEn.raw('products.nexus.detail.complianceStandards.standards') as typeof standards;
              }
              
              if (!standards || !Array.isArray(standards)) {
                return null;
              }

              // Get learnMore text - try direct translation first, then fallback
              let learnMoreText = t('products.nexus.detail.complianceStandards.learnMore');
              // Check if translation failed (returned key path)
              if (!learnMoreText || 
                  learnMoreText === 'products.nexus.detail.complianceStandards.learnMore' ||
                  learnMoreText.startsWith('products.') ||
                  learnMoreText.includes('complianceStandards.learnMore')) {
                // Fallback to English
                learnMoreText = tEn('products.nexus.detail.complianceStandards.learnMore');
                // If still failed, use getT
                if (!learnMoreText || 
                    learnMoreText === 'products.nexus.detail.complianceStandards.learnMore' ||
                    learnMoreText.startsWith('products.') ||
                    learnMoreText.includes('complianceStandards.learnMore')) {
                  learnMoreText = getT('products.nexus.detail.complianceStandards.learnMore');
                }
              }

              return standards.map((standard, index) => {
                return (
                  <HoverableDiv 
                    key={index}
                    style={{
                      padding: '2rem',
                      background: 'var(--light-color)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow)',
                      cursor: 'pointer'
                    }}
                    hoverStyle={{
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
                    }}
                    defaultStyle={{
                      transform: 'translateY(0)',
                      boxShadow: 'var(--shadow)'
                    }}
                  >
                    <Link 
                      href={`/faq/${standard.slug}` as any} 
                      locale={locale as any}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block'
                      }}
                    >
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        color: 'var(--primary-color)'
                      }}>
                        {standard.title}
                      </div>
                      <div 
                        style={{
                          lineHeight: 1.6,
                          color: 'var(--text-color)',
                          marginBottom: '1rem'
                        }}
                        dangerouslySetInnerHTML={{__html: standard.description}}
                      />
                      <span style={{
                        color: 'var(--primary-color)',
                        fontWeight: 500,
                        textDecoration: 'underline',
                        fontSize: '0.95rem'
                      }}>
                        {learnMoreText}
                      </span>
                    </Link>
                  </HoverableDiv>
                );
              });
            })()}
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
    console.error('Error in NexusDx1Page:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
