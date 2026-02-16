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
        title: 'MSQA-100 | iSperm Medical',
        description: 'Mobile CASA system for semen analysis.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'MSQA-100 | iSperm Medical',
        description: 'Mobile CASA system for semen analysis.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'products'});

    return {
      title: t('products.msqaMeta.title'),
      description: t('products.msqaMeta.description'),
      alternates: generateHreflangAlternates('/products/msqa-100', locale),
    };
  } catch (error) {
    console.error('Error in msqa-100 generateMetadata:', error);
    return {
      title: 'MSQA-100 | iSperm Medical',
      description: 'Mobile CASA system for semen analysis.',
    };
  }
}

export default async function MSQA100Page({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in MSQA100Page');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in MSQA100Page');
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
            <h1 className="hero-title">{getT('products.msqa.name')}</h1>
            <p className="hero-subtitle">{getT('products.msqa.heroSubtitle')}</p>
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
              <li style={{color: 'var(--text-light)'}}>{getT('products.msqa.name')}</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="products-detail">
        <div className="container">
          <div className="product-detail-content">
            <div className="product-detail-text">
              <h2>{getT('products.msqa.name')}</h2>
              <p className="product-subtitle">{getT('products.msqa.subtitle')}</p>
              <p>{getT('products.msqa.detail.description')}</p>
              
              <h3>{getT('products.msqa.detail.keyTechnologies.title')}</h3>
              <ul className="product-features-list">
                {(() => {
                  let items = t.raw('products.msqa.detail.keyTechnologies.items') as Array<{label?: string; text: string}> | undefined;
                  if (!items || !Array.isArray(items)) {
                    items = tEn.raw('products.msqa.detail.keyTechnologies.items') as Array<{label?: string; text: string}> | undefined;
                  }
                  if (!items || !Array.isArray(items)) return null;
                  return items.map((item, index) => (
                    <li key={index}>
                      {item.label && <strong>{item.label} </strong>}
                      {item.text}
                    </li>
                  ));
                })()}
              </ul>

              <h3>{getT('products.msqa.detail.measuredParameters.title')}</h3>
              <div className="parameters-grid">
                {(() => {
                  let groups = t.raw('products.msqa.detail.measuredParameters.groups') as Array<{title: string; items: string[]}> | undefined;
                  if (!groups || !Array.isArray(groups)) {
                    groups = tEn.raw('products.msqa.detail.measuredParameters.groups') as Array<{title: string; items: string[]}> | undefined;
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

              <h3>{getT('products.msqa.detail.physicalSpecs.title')}</h3>
              <ul className="product-features-list">
                {(() => {
                  let items = t.raw('products.msqa.detail.physicalSpecs.items') as Array<{label?: string; text: string}> | undefined;
                  if (!items || !Array.isArray(items)) {
                    items = tEn.raw('products.msqa.detail.physicalSpecs.items') as Array<{label?: string; text: string}> | undefined;
                  }
                  if (!items || !Array.isArray(items)) return null;
                  return items.map((item, index) => (
                    <li key={index}>
                      {item.label && <strong>{item.label} </strong>}
                      {item.text}
                    </li>
                  ));
                })()}
              </ul>

              <h3>{getT('products.msqa.detail.applications.title')}</h3>
              <p>{getT('products.msqa.detail.applications.intro')}</p>
              <ul className="product-features-list">
                {(() => {
                  let items = t.raw('products.msqa.detail.applications.items') as string[] | undefined;
                  if (!items || !Array.isArray(items)) {
                    items = tEn.raw('products.msqa.detail.applications.items') as string[] | undefined;
                  }
                  if (!items || !Array.isArray(items)) return null;
                  return items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ));
                })()}
              </ul>
            </div>
            <div className="product-detail-image">
              <div className="product-images-list">
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-1.webp" 
                    alt={`${getT('products.msqa.name')} Portable CASA Semen Analyzer - Home-use sperm analysis device with microfluidic technology`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-2.webp" 
                    alt={`${t('products.msqa.name')} Portable CASA system showing smartphone compatibility and compact design`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-3.webp" 
                    alt={`${t('products.msqa.name')} built-in temperature control module maintaining 37°C for accurate sperm motility analysis`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-4.webp" 
                    alt={`${t('products.msqa.name')} ultra-microfluidic polymer biochip with 7μm fixed observation chamber`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-5.webp" 
                    alt={`${t('products.msqa.name')} cloud-based AI analysis system with Gaussian dynamic image intelligent algorithm`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-6.webp" 
                    alt={`${t('products.msqa.name')} automatic focus microscopic vision system for precise sperm evaluation`}
                    fill
                    quality={85}
                    style={{objectFit: 'contain', padding: '1rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 968px) 50vw, 33vw"
                  />
                </div>
                <div className="product-image-item" style={{position: 'relative', aspectRatio: '4/3'}}>
                  <Image 
                    src="/MSQA-100/msqa-100-7.webp" 
                    alt={`${t('products.msqa.name')} fully automated analysis interface with minimal user operation`}
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
                <li><Link href="/faq" locale={locale as any}>{t('nav.knowledgeHub')}</Link></li>
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
    console.error('Error in MSQA100Page:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
