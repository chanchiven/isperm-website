'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import AnimatedSection from '@/components/AnimatedSection';
import {Activity, Brain, Package, BarChart3} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const t = useTranslations('index');
  const locale = useLocale();

  // Hero carousel functionality - DISABLED
  // Banner is now fixed to display only the first image (banner (1).webp)
  // See: 如何修复网页到现在的状态.md - Section 7

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="hero">
        {/* Banner - Optimized responsive image for better LCP performance */}
        <div className="hero-carousel">
          <div className="carousel-slides">
            <div className="carousel-slide active">
              <picture>
                {/* Desktop: larger image (41KB) */}
                <source media="(min-width: 769px)" srcSet="/banner%20(1).webp" />
                {/* Mobile: smaller image (13.7KB) for faster loading */}
                <img 
                  src="/mobile/banner%20(1).webp"
                  alt=""
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  fetchPriority="high"
                />
              </picture>
              <div className="hero-overlay"></div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
            <p className="hero-description">{t('hero.description')}</p>
            <div className="hero-buttons">
              <Link href="/products" className="btn btn-primary">
                {t('hero.exploreProducts')}
              </Link>
              <Link href="/about" className="btn btn-secondary">
                {t('hero.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="about-preview">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>{t('about.title')}</h2>
              <p style={{fontSize: '1.3rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '2rem'}}>
                {t('about.tagline')}
              </p>
              <div style={{lineHeight: 1.8}}>
                <p style={{marginBottom: '1.5rem', color: 'var(--text-color)'}}>
                  {t('about.description')}
                </p>
                <p style={{marginBottom: '2rem', color: 'var(--text-color)'}}>
                  {t('about.description2')}
                </p>
              </div>
              <Link href="/about" className="btn btn-primary">
                {t('about.ourStory')}
              </Link>
            </div>
            <div className="about-image" style={{position: 'relative', width: '100%', aspectRatio: '4/3'}}>
              <Image 
                src="/About iSperm.webp" 
                alt={t('about.heroImage.alt')} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                style={{objectFit: 'cover', borderRadius: '8px'}}
                loading="lazy"
                quality={85}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Core Technology Matrix */}
      <section className="features" style={{
        padding: '120px 0',
        background: '#FFFFFF',
        position: 'relative',
        backgroundImage: 'url("/Advanced%20Technology.webp")',
        backgroundSize: '60%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          zIndex: 0
        }}></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <AnimatedSection
            className="section-header"
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.6}}
            style={{
              textAlign: 'center',
              marginBottom: '5rem'
            }}
          >
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 700,
              color: '#333333',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              {t('features.title')}
            </h2>
            <p style={{
              fontSize: '1.3rem',
              color: '#666666',
              fontWeight: 400
            }}>
              {t('features.subtitle')}
            </p>
          </AnimatedSection>
          <div className="features-tech-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '3rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Standardized Workflow */}
            <AnimatedSection
              initial={{opacity: 0, y: 40}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-100px'}}
              transition={{duration: 0.6, delay: 0.1}}
              style={{
                background: '#FFFFFF',
                padding: '3rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#F0FDFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <Activity size={32} color="#00776E" strokeWidth={2.5} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#333333',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                {t('features.automated.title')}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#666666',
                margin: 0
              }}>
                {t('features.automated.description')}
              </p>
            </AnimatedSection>

            {/* Intelligent AI Recognition */}
            <AnimatedSection
              initial={{opacity: 0, y: 40}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-100px'}}
              transition={{duration: 0.6, delay: 0.2}}
              style={{
                background: '#FFFFFF',
                padding: '3rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#F0FDFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <Brain size={32} color="#00776E" strokeWidth={2.5} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#333333',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                {t('features.aiPowered.title')}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#666666',
                marginBottom: '1rem'
              }}>
                {t('features.aiPowered.description')}
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: '#999999',
                margin: 0,
                fontStyle: 'italic'
              }}>
                {t('features.aiPowered.compliance')}
              </p>
            </AnimatedSection>

            {/* Integrated Versatility */}
            <AnimatedSection
              initial={{opacity: 0, y: 40}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-100px'}}
              transition={{duration: 0.6, delay: 0.3}}
              style={{
                background: '#FFFFFF',
                padding: '3rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#F0FDFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <Package size={32} color="#00776E" strokeWidth={2.5} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#333333',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                {t('features.standalone.title')}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#666666',
                margin: 0
              }}>
                {t('features.standalone.description')}
              </p>
            </AnimatedSection>

            {/* Advanced Analytics */}
            <AnimatedSection
              initial={{opacity: 0, y: 40}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-100px'}}
              transition={{duration: 0.6, delay: 0.4}}
              style={{
                background: '#FFFFFF',
                padding: '3rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              whileHover={{
                y: -8,
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '12px',
                background: '#F0FDFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <BarChart3 size={32} color="#00776E" strokeWidth={2.5} />
              </div>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#333333',
                marginBottom: '1rem',
                lineHeight: '1.3'
              }}>
                {t('features.comprehensive.title')}
              </h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                color: '#666666',
                margin: 0
              }}>
                {t('features.comprehensive.description')}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="timeline-header">
            <h2>{t('timeline.title')}</h2>
            <p>{t('timeline.subtitle')}</p>
          </div>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-year">2010</div>
              <div className="timeline-content">
                <p>{t('timeline.2010')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2016</div>
              <div className="timeline-content">
                <p>{t('timeline.2016')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">2017</div>
              <div className="timeline-content">
                <p>{t('timeline.2017')}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-year">Today</div>
              <div className="timeline-content">
                <p>{t('timeline.today')}</p>
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

