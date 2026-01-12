'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Navigation } from '@/components/Navigation';
import { SearchResults } from '@/components/SearchResults';
import { search } from '@/lib/search/search';
import { SearchResponse } from '@/lib/search/types';
import { Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

/**
 * 搜索结果页面
 */
export default function SearchPage() {
  const t = useTranslations('search');
  const tIndex = useTranslations('index');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    search(query, locale)
      .then((searchResults) => {
        setResults(searchResults);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Search error:', err);
        setError(t('error') || '搜索出错，请稍后重试');
        setIsLoading(false);
      });
  }, [query, locale, t]);

  return (
    <div>
      <Navigation />

      {/* 搜索页面头部 */}
      <section className="hero" style={{ minHeight: '40vh', position: 'relative' }}>
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
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-content">
            <h1 className="hero-title">{t('pageTitle')}</h1>
            {query && (
              <p className="hero-subtitle">{t('searchingFor')}: "{query}"</p>
            )}
          </div>
        </div>
      </section>

      {/* 搜索结果内容 */}
      <section className="about-section" style={{ padding: '80px 0' }}>
        <div className="container">
          {!query.trim() && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-color-secondary)' }}>
                {t('enterQuery')}
              </p>
            </div>
          )}

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Loader2 size={48} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <p style={{ marginTop: '1rem', color: 'var(--text-color-secondary)' }}>
                {t('searching')}
              </p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ color: 'var(--error-color, #dc3545)' }}>{error}</p>
            </div>
          )}

          {results && results.total === 0 && !isLoading && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-color-secondary)' }}>
                {t('noResults')}
              </p>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-color-secondary)' }}>
                {t('tryDifferentQuery')}
              </p>
            </div>
          )}

          {results && results.total > 0 && !isLoading && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: 'var(--text-color-secondary)' }}>
                  {t('foundResults', { count: results.total, query: results.query })}
                </p>
              </div>
              <SearchResults results={results} />
            </div>
          )}
        </div>
      </section>

      {/* Footer - 使用 index 翻译 */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{tIndex('footer.company')}</h3>
              <p>{tIndex('footer.description')}</p>
            </div>
            <div className="footer-section">
              <h4>{tIndex('footer.quickLinks')}</h4>
              <ul>
                <li><Link href="/" locale={locale as any}>{tIndex('nav.home')}</Link></li>
                <li><Link href="/products" locale={locale as any}>{tIndex('nav.products')}</Link></li>
                <li><Link href="/about" locale={locale as any}>{tIndex('nav.about')}</Link></li>
                <li><Link href="/contact" locale={locale as any}>{tIndex('nav.contact')}</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>{tIndex('footer.contact')}</h4>
              <p>{tIndex('footer.email')} <a href="mailto:market@isperm.com">market@isperm.com</a></p>
              <p>{tIndex('footer.address')} {tIndex('footer.fullAddress')}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{tIndex('footer.rights')}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
