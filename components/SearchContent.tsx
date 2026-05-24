'use client';

import {useTranslations} from 'next-intl';
import {SearchPageStatus} from './search/SearchPageStatus';
import {useSearchPageQuery} from './search/useSearchPageQuery';

export function SearchContent() {
  const t = useTranslations('search');
  const {query, results, isLoading, error} = useSearchPageQuery();

  return (
    <SearchPageStatus
      query={query}
      results={results}
      isLoading={isLoading}
      error={error}
      t={t}
    />
  );
}
