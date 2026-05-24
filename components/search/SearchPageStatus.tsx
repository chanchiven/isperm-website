'use client';

import {memo} from 'react';
import {Loader2} from 'lucide-react';
import {SearchResults} from '@/components/SearchResults';
import {SearchResponse} from '@/lib/search/types';
import {searchCenterPanelStyle, searchQueryIntroStyle} from './searchModalStyles';

interface SearchPageStatusProps {
  query: string;
  results: SearchResponse | null;
  isLoading: boolean;
  error: string | null;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export const SearchPageStatus = memo(function SearchPageStatus({
  query,
  results,
  isLoading,
  error,
  t
}: SearchPageStatusProps) {
  return (
    <>
      {query ? (
        <p style={searchQueryIntroStyle}>
          {t('searchingFor')}: &quot;{query}&quot;
        </p>
      ) : null}

      {!query.trim() ? (
        <div style={searchCenterPanelStyle}>
          <p style={{fontSize: '1.125rem', color: 'var(--text-color-secondary)'}}>{t('enterQuery')}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div style={searchCenterPanelStyle}>
          <Loader2
            size={48}
            color="var(--primary-color)"
            className="search-spinner"
            style={{margin: '0 auto'}}
          />
          <p style={{marginTop: '1rem', color: 'var(--text-color-secondary)'}}>{t('searching')}</p>
        </div>
      ) : null}

      {error ? (
        <div style={searchCenterPanelStyle}>
          <p style={{color: 'var(--error-color, #dc3545)'}}>{t('error') || 'Search error, please try again'}</p>
        </div>
      ) : null}

      {results && results.total === 0 && !isLoading ? (
        <div style={searchCenterPanelStyle}>
          <p style={{fontSize: '1.125rem', color: 'var(--text-color-secondary)'}}>{t('noResults')}</p>
          <p style={{marginTop: '0.5rem', color: 'var(--text-color-secondary)'}}>{t('tryDifferentQuery')}</p>
        </div>
      ) : null}

      {results && results.total > 0 && !isLoading ? (
        <div>
          <div style={{marginBottom: '2rem'}}>
            <p style={{color: 'var(--text-color-secondary)'}}>
              {t('foundResults', {count: results.total, query: results.query})}
            </p>
          </div>
          <SearchResults results={results} />
        </div>
      ) : null}
    </>
  );
});
