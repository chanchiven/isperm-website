'use client';

import {useTranslations} from 'next-intl';
import {SearchResults} from '../SearchResults';
import {SearchModalHeader} from './SearchModalHeader';
import {SearchFilterPanel} from './SearchFilterPanel';
import {SearchSuggestionsList} from './SearchSuggestionsList';
import {SearchHistoryList} from './SearchHistoryList';
import {PopularSearchesList} from './PopularSearchesList';
import {useSearchModal} from './useSearchModal';
import {overlayStyle, modalStyle, bodyStyle, footerStyle} from './searchModalStyles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({isOpen, onClose}: SearchModalProps) {
  const t = useTranslations('search');
  const {
    inputRef,
    query,
    setQuery,
    results,
    isLoading,
    hasSearched,
    searchHistory,
    setSearchHistory,
    showHistory,
    setShowHistory,
    suggestions,
    showSuggestions,
    popularSearches,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    selectQuery
  } = useSearchModal(isOpen, onClose);

  if (!isOpen) return null;

  const showEmptyHint =
    !hasSearched && !query.trim() && !showHistory && popularSearches.length === 0;

  return (
    <div className="search-modal-overlay" onClick={onClose} style={overlayStyle}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <SearchModalHeader
          inputRef={inputRef}
          query={query}
          onQueryChange={setQuery}
          placeholder={t('placeholder')}
          isLoading={isLoading}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((prev) => !prev)}
          filtersTitle={t('filters.title')}
          onClose={onClose}
        />

        {showFilters && (
          <SearchFilterPanel filters={filters} onChange={setFilters} />
        )}

        <div style={bodyStyle}>
          {showSuggestions && query.trim().length >= 2 && (
            <SearchSuggestionsList
              suggestions={suggestions}
              title={t('suggestions')}
              onSelect={selectQuery}
            />
          )}

          {showHistory && (
            <SearchHistoryList
              history={searchHistory}
              recentTitle={t('recentSearches')}
              clearLabel={t('clear')}
              clearTitle={t('clearHistory')}
              resultsLabel={t('results')}
              removeTitle={t('removeFromHistory')}
              onSelect={selectQuery}
              onHistoryChange={setSearchHistory}
              onVisibilityChange={setShowHistory}
            />
          )}

          {!hasSearched && !query.trim() && !showHistory && (
            <PopularSearchesList
              items={popularSearches}
              title={t('popularSearches')}
              onSelect={selectQuery}
            />
          )}

          {showEmptyHint && (
            <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)'}}>
              {t('startTyping')}
            </div>
          )}

          {hasSearched && results && (
            <SearchResults results={results} onResultClick={onClose} />
          )}

          {hasSearched && results && results.total === 0 && (
            <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)'}}>
              {t('noResults')}
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <span>{t('shortcutHint')}</span>
          {results && results.total > 0 && (
            <span>{t('resultsCount', {count: results.total})}</span>
          )}
        </div>
      </div>
    </div>
  );
}
