'use client';

import {memo} from 'react';
import {SearchResult} from '@/lib/search/types';
import {SearchResultItem} from './SearchResultItem';

interface SearchResultGroupProps {
  title: string;
  results: SearchResult[];
  query: string;
  locale: string;
  getTypeLabel: (type: string) => string;
  onResultClick?: () => void;
}

export const SearchResultGroup = memo(function SearchResultGroup({
  title,
  results,
  query,
  locale,
  getTypeLabel,
  onResultClick
}: SearchResultGroupProps) {
  if (results.length === 0) return null;

  return (
    <div style={{marginBottom: '1.5rem'}}>
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
        {title} ({results.length})
      </h3>
      {results.map((result) => (
        <SearchResultItem
          key={result.id}
          result={result}
          query={query}
          locale={locale}
          typeLabel={getTypeLabel(result.type)}
          onResultClick={onResultClick}
        />
      ))}
    </div>
  );
});
