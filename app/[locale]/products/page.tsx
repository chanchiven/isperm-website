'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {useEffect, useRef} from 'react';
import Image from 'next/image';

export default function ProductsPage() {
  const t = useTranslations('products');
  const locale = useLocale();
  const productCardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;

    // Add visible class to fade-in-up elements when they enter viewport
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Use requestAnimationFrame to delay viewport check and avoid layout thrashing
    requestAnimationFrame(() => {
      productCardsRef.current.forEach(card => {
        if (card) {
          // Check if element is already in viewport
          const rect = card.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
          if (isInViewport) {
            card.classList.add('visible');
          } else {
            observer.observe(card);
          }
        }
      });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Products Hero Section with Banner */}
      <section className="hero" style={{minHeight: '60vh', position: 'relative'}}>
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
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="hero-content">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Products Content */}
      <section className="products-section" style={{padding: '60px 0', background: '#FFFFFF'}}>
        <div className="container">
          
          {/* Products Grid */}
          <section className="products-preview" style={{padding: '80px 0'}}>
            <div className="section-header">
              <h2>{t('section.title')}</h2>
              <p>{t('section.subtitle')}</p>
            </div>
            <div className="products-grid products-page-grid">
              {/* Nexus Dx1 */}
              <Link 
                href="/products/nexus-dx1"
                locale={locale as any}
                ref={(el) => { if (el) productCardsRef.current[0] = el as any; }}
                className="product-card product-card-nexus fade-in-up"
                style={{cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block'}}
              >
                <div className="product-image">
                  <Image 
                    src="/nexus-dx1-cover.webp" 
                    alt={`${t('products.nexus.name')} - ${t('products.nexus.badge')}`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1.5rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="product-content">
                  <div className="product-header">
                    <h3>{t('products.nexus.name')}</h3>
                    <span className="product-tag">{t('products.nexus.tag')}</span>
                  </div>
                  <p className="product-badge">{t('products.nexus.badge')}</p>
                  <p className="product-description">{t('products.nexus.description')}</p>
                  <ul className="product-features">
                    <li>{t('products.nexus.feature1')}</li>
                    <li>{t('products.nexus.feature2')}</li>
                    <li>{t('products.nexus.feature3')}</li>
                  </ul>
                  <div className="btn btn-outline product-btn" style={{display: 'inline-block'}}>{t('products.nexus.button')}</div>
                </div>
              </Link>

              {/* MSQA-100 */}
              <Link 
                href="/products/msqa-100"
                locale={locale as any}
                ref={(el) => { if (el) productCardsRef.current[1] = el as any; }}
                className="product-card product-card-msqa fade-in-up"
                style={{cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block'}}
              >
                <div className="product-image">
                  <Image 
                    src="/MSQA-100/msqa-100-cover.webp" 
                    alt={`${t('products.msqa.name')} - ${t('products.msqa.badge')}`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1.5rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="product-content">
                  <div className="product-header">
                    <h3>{t('products.msqa.name')}</h3>
                    <span className="product-tag">{t('products.msqa.tag')}</span>
                  </div>
                  <p className="product-badge">{t('products.msqa.badge')}</p>
                  <p className="product-description">{t('products.msqa.description')}</p>
                  <ul className="product-features">
                    <li>{t('products.msqa.feature1')}</li>
                    <li>{t('products.msqa.feature2')}</li>
                    <li>{t('products.msqa.feature3')}</li>
                  </ul>
                  <div className="btn btn-outline product-btn" style={{display: 'inline-block'}}>{t('products.msqa.button')}</div>
                </div>
              </Link>

              {/* SQA-6100vet */}
              <Link 
                href="/products/sqa-6100vet"
                locale={locale as any}
                ref={(el) => { if (el) productCardsRef.current[2] = el as any; }}
                className="product-card product-card-vet fade-in-up"
                style={{cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block'}}
              >
                <div className="product-image">
                  <Image 
                    src="/sqa-6100vet-cover.webp" 
                    alt={`${t('products.sqavet.name')} - ${t('products.sqavet.badge')}`}
                    fill
                    priority
                    quality={85}
                    style={{objectFit: 'contain', padding: '1.5rem'}}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="product-content">
                  <div className="product-header">
                    <h3>{t('products.sqavet.name')}</h3>
                    <span className="product-tag product-tag-vet">{t('products.sqavet.tag')}</span>
                  </div>
                  <p className="product-badge">{t('products.sqavet.badge')}</p>
                  <p className="product-description">{t('products.sqavet.description')}</p>
                  <ul className="product-features">
                    <li>{t('products.sqavet.feature1')}</li>
                    <li>{t('products.sqavet.feature2')}</li>
                    <li>{t('products.sqavet.feature3')}</li>
                  </ul>
                  <div className="btn btn-outline product-btn" style={{display: 'inline-block'}}>{t('products.sqavet.button')}</div>
                </div>
              </Link>
            </div>
          </section>
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
}

