'use client';

import {useMemo} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {SearchResult} from '@/lib/search/types';
import {SearchResultGroup} from './searchResults/SearchResultGroup';
import {getTypeLabel, groupSearchResults} from './searchResults/searchResultUtils';

interface SearchResultsProps {
  results: {
    query: string;
    results: SearchResult[];
    total: number;
    locale: string;
  };
  onResultClick?: () => void;
}

export function SearchResults({results, onResultClick}: SearchResultsProps) {
  const locale = useLocale();
  const t = useTranslations('search');

  const groupedResults = useMemo(
    () => groupSearchResults(results.results),
    [results.results]
  );

  const typeLabelFn = useMemo(
    () => (type: string) => getTypeLabel(type, t),
    [t]
  );

  const groups = [
    {key: 'products' as const, label: t('types.product')},
    {key: 'articles' as const, label: t('types.article')},
    {key: 'images' as const, label: t('types.image')},
    {key: 'pages' as const, label: t('types.page')}
  ];

  return (
    <div>
      {groups.map(({key, label}) => (
        <SearchResultGroup
          key={key}
          title={label}
          results={groupedResults[key]}
          query={results.query}
          locale={locale}
          getTypeLabel={typeLabelFn}
          onResultClick={onResultClick}
        />
      ))}
    </div>
  );
}
