'use client';

import {memo} from 'react';
import {Link} from '@/i18n/routing';
import {SearchResult} from '@/lib/search/types';
import {getTypeIcon, highlightText} from './searchResultUtils';

interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  locale: string;
  typeLabel: string;
  onResultClick?: () => void;
}

export const SearchResultItem = memo(function SearchResultItem({
  result,
  query,
  locale,
  typeLabel,
  onResultClick
}: SearchResultItemProps) {
  return (
    <Link
      href={result.url as any}
      locale={locale as any}
      className="search-result-link"
      onClick={onResultClick}
    >
      <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
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
        <div style={{flex: 1, minWidth: 0}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-color)'
              }}
            >
              {highlightText(result.title, query)}
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
              {typeLabel}
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
              {highlightText(result.description, query)}
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
});
