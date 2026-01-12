'use client';

import { SearchResult } from '@/lib/search/types';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Package, FileText, Image as ImageIcon, Globe } from 'lucide-react';
import Image from 'next/image';

interface SearchResultsProps {
  results: {
    query: string;
    results: SearchResult[];
    total: number;
    locale: string;
  };
  onResultClick?: () => void;
}

/**
 * 搜索结果展示组件
 */
export function SearchResults({ results, onResultClick }: SearchResultsProps) {
  const locale = useLocale();
  const t = useTranslations('search');

  // 按类型分组结果
  const groupedResults = {
    products: results.results.filter(r => r.type === 'product'),
    articles: results.results.filter(r => r.type === 'article'),
    images: results.results.filter(r => r.type === 'image'),
    pages: results.results.filter(r => r.type === 'page')
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package size={16} />;
      case 'article':
        return <FileText size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
      case 'page':
        return <Globe size={16} />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return t('types.product') || 'Product';
      case 'article':
        return t('types.article') || 'Article';
      case 'image':
        return t('types.image') || 'Image';
      case 'page':
        return t('types.page') || 'Page';
      default:
        return '';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0 2px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const renderResult = (result: SearchResult) => {
    return (
      <Link
        key={result.id}
        href={result.url as any}
        locale={locale as any}
        onClick={onResultClick}
        style={{
          display: 'block',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          marginBottom: '0.75rem',
          textDecoration: 'none',
          color: 'inherit',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary-color)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          {/* 图标 */}
          <div
            style={{
              flexShrink: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)'
            }}
          >
            {getTypeIcon(result.type)}
          </div>

          {/* 内容 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-color)'
                }}
              >
                {highlightText(result.title, results.query)}
              </h4>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-color-secondary)',
                  padding: '0.125rem 0.5rem',
                  backgroundColor: 'var(--light-color)',
                  borderRadius: '4px'
                }}
              >
                {getTypeLabel(result.type)}
              </span>
            </div>
            {result.description && (
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: 'var(--text-color-secondary)',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {highlightText(result.description, results.query)}
              </p>
            )}
            {result.image && (
              <div
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  maxWidth: '200px',
                  height: '120px',
                  position: 'relative',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--light-color)'
                }}
              >
                <img
                  src={result.image}
                  alt={result.alt || result.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div>
      {groupedResults.products.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-color-secondary)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {t('types.product')} ({groupedResults.products.length})
          </h3>
          {groupedResults.products.map(renderResult)}
        </div>
      )}

      {groupedResults.articles.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-color-secondary)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {t('types.article')} ({groupedResults.articles.length})
          </h3>
          {groupedResults.articles.map(renderResult)}
        </div>
      )}

      {groupedResults.images.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-color-secondary)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {t('types.image')} ({groupedResults.images.length})
          </h3>
          {groupedResults.images.map(renderResult)}
        </div>
      )}

      {groupedResults.pages.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-color-secondary)',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {t('types.page')} ({groupedResults.pages.length})
          </h3>
          {groupedResults.pages.map(renderResult)}
        </div>
      )}
    </div>
  );
}
