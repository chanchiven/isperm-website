'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useLocale} from 'next-intl';
import {search} from '@/lib/search/search';
import {SearchResponse} from '@/lib/search/types';

export function useSearchPageQuery() {
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
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    search(query, locale)
      .then((searchResults) => {
        if (cancelled) return;
        setResults(searchResults);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Search error:', err);
        setError('search_failed');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, locale]);

  return {query, results, isLoading, error};
}
