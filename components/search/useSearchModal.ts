'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import {useLocale} from 'next-intl';
import {search, debounce} from '@/lib/search/search';
import {SearchResponse, SearchFilters} from '@/lib/search/types';
import {
  getSearchHistory,
  saveSearchHistory,
  SearchHistoryItem
} from '@/lib/search/history';
import {getSearchSuggestions, getPopularSearches} from '@/lib/search/suggestions';

export function useSearchModal(isOpen: boolean, onClose: () => void) {
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const localeRef = useRef(locale);
  const filtersRef = useRef(filters);
  localeRef.current = locale;
  filtersRef.current = filters;

  const refreshHistory = useCallback(() => {
    const history = getSearchHistory();
    setSearchHistory(history);
    return history;
  }, []);

  const runSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await search(searchQuery, localeRef.current, filtersRef.current);
      setResults(searchResults);
      setHasSearched(true);
      saveSearchHistory(searchQuery, searchResults.total);
      refreshHistory();
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        query: searchQuery,
        results: [],
        total: 0,
        locale: localeRef.current
      });
      setHasSearched(true);
      saveSearchHistory(searchQuery, 0);
      refreshHistory();
    } finally {
      setIsLoading(false);
    }
  }, [refreshHistory]);

  const debouncedSearchRef = useRef(debounce(runSearch, 300));
  useEffect(() => {
    debouncedSearchRef.current = debounce(runSearch, 300);
  }, [runSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const history = refreshHistory();
    setShowHistory(!query.trim() && history.length > 0);
    getPopularSearches(locale).then(setPopularSearches);
  }, [isOpen, locale, query, refreshHistory]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      getSearchSuggestions(query, locale, 5).then((sugs) => {
        setSuggestions(sugs);
        setShowSuggestions(sugs.length > 0);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, locale]);

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setShowHistory(false);
      debouncedSearchRef.current(query);
    } else {
      setResults(null);
      setHasSearched(false);
      setIsLoading(false);
      setShowHistory(getSearchHistory().length > 0);
    }
  }, [query, filters]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const selectQuery = useCallback((value: string) => {
    setQuery(value);
    setShowHistory(false);
    setShowSuggestions(false);
  }, []);

  return {
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
    selectQuery,
    refreshHistory
  };
}
