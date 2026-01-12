'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, Loader2, Clock, Trash2, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { search, debounce } from '@/lib/search/search';
import { SearchResponse, SearchResult, SearchFilters } from '@/lib/search/types';
import { SearchResults } from './SearchResults';
import { Link } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { getSearchHistory, saveSearchHistory, clearSearchHistory, removeSearchHistoryItem, SearchHistoryItem } from '@/lib/search/history';
import { getSearchSuggestions, getPopularSearches } from '@/lib/search/suggestions';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

/**
 * 搜索模态框组件
 * 包含搜索输入框和实时搜索结果
 */
export function SearchModal({ isOpen, onClose, locale }: SearchModalProps) {
  const t = useTranslations('search');
  const currentLocale = useLocale();
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

  // 加载搜索历史和热门搜索
  useEffect(() => {
    if (isOpen) {
      const history = getSearchHistory();
      setSearchHistory(history);
      setShowHistory(!query.trim() && history.length > 0);
      
      // 加载热门搜索
      getPopularSearches(currentLocale).then(setPopularSearches);
    }
  }, [isOpen, currentLocale, query]);

  // 加载搜索建议
  useEffect(() => {
    if (query.trim().length >= 2) {
      getSearchSuggestions(query, currentLocale, 5).then(sugs => {
        setSuggestions(sugs);
        setShowSuggestions(sugs.length > 0);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, currentLocale]);

  // 防抖搜索函数
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults(null);
        setHasSearched(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await search(searchQuery, currentLocale, filters);
        setResults(searchResults);
        setHasSearched(true);
        // 保存搜索历史
        saveSearchHistory(searchQuery, searchResults.total);
        setSearchHistory(getSearchHistory());
      } catch (error) {
        console.error('Search error:', error);
        setResults({
          query: searchQuery,
          results: [],
          total: 0,
          locale: currentLocale
        });
        setHasSearched(true);
        // 即使出错也保存搜索历史
        saveSearchHistory(searchQuery, 0);
        setSearchHistory(getSearchHistory());
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // 处理输入变化和筛选变化
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setShowHistory(false);
      debouncedSearch(query);
    } else {
      setResults(null);
      setHasSearched(false);
      setIsLoading(false);
      setShowHistory(getSearchHistory().length > 0);
    }
  }, [query, filters, debouncedSearch]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(null);
      setHasSearched(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="search-modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        padding: '2rem'
      }}
    >
      <div
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--white)',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          overflow: 'hidden'
        }}
      >
        {/* 搜索输入框 */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <Search size={20} color="var(--text-color)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('placeholder')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-color)',
              background: 'transparent'
            }}
          />
          {isLoading && (
            <Loader2 size={20} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: showFilters ? 'var(--primary-color)' : 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              color: showFilters ? 'var(--white)' : 'var(--text-color)',
              transition: 'all 0.2s ease'
            }}
            title={t('filters.title')}
          >
            <Filter size={18} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-color)'
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* 筛选面板 */}
        {showFilters && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--light-color)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* 类型筛选 */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  {t('filters.type')}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(['product', 'article', 'image', 'page'] as const).map((type) => {
                    const isSelected = !filters.types || filters.types.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          const currentTypes = filters.types || ['product', 'article', 'image', 'page'];
                          const newTypes = isSelected
                            ? currentTypes.filter(t => t !== type)
                            : [...currentTypes, type];
                          setFilters({
                            ...filters,
                            types: newTypes.length === 4 ? undefined : newTypes
                          });
                        }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: isSelected ? 'var(--primary-color)' : 'var(--white)',
                          border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: isSelected ? 'var(--white)' : 'var(--text-color)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {t(`types.${type}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 分类筛选（仅对文章） */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  {t('filters.category')}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(['human', 'veterinary'] as const).map((category) => {
                    const isSelected = !filters.categories || filters.categories.includes(category);
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          const currentCategories = filters.categories || ['human', 'veterinary'];
                          const newCategories = isSelected
                            ? currentCategories.filter(c => c !== category)
                            : [...currentCategories, category];
                          setFilters({
                            ...filters,
                            categories: newCategories.length === 2 ? undefined : newCategories
                          });
                        }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: isSelected ? 'var(--primary-color)' : 'var(--white)',
                          border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: isSelected ? 'var(--white)' : 'var(--text-color)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {t(`filters.${category}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 排序 */}
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  {t('filters.sortBy')}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setFilters({ ...filters, sortBy: 'relevance' })}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: (!filters.sortBy || filters.sortBy === 'relevance') ? 'var(--primary-color)' : 'var(--white)',
                      border: `1px solid ${(!filters.sortBy || filters.sortBy === 'relevance') ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: (!filters.sortBy || filters.sortBy === 'relevance') ? 'var(--white)' : 'var(--text-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t('filters.relevance')}
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, sortBy: 'title' })}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: filters.sortBy === 'title' ? 'var(--primary-color)' : 'var(--white)',
                      border: `1px solid ${filters.sortBy === 'title' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: filters.sortBy === 'title' ? 'var(--white)' : 'var(--text-color)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t('filters.titleSort')}
                  </button>
                </div>
              </div>

              {/* 清除筛选 */}
              {(filters.types || filters.categories || filters.sortBy) && (
                <button
                  onClick={() => setFilters({})}
                  style={{
                    padding: '0.5rem',
                    background: 'transparent',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-color-secondary)',
                    transition: 'all 0.2s ease',
                    alignSelf: 'flex-start'
                  }}
                >
                  {t('filters.clearFilters')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 搜索结果或搜索历史 */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
          }}
        >
          {/* 显示搜索建议 */}
          {showSuggestions && suggestions.length > 0 && query.trim().length >= 2 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={16} color="var(--primary-color)" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', margin: 0 }}>
                  {t('suggestions')}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'var(--white)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.backgroundColor = 'var(--light-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.backgroundColor = 'var(--white)';
                    }}
                  >
                    <Search size={14} color="var(--text-color-secondary)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 显示搜索历史 */}
          {showHistory && searchHistory.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', margin: 0 }}>
                  {t('recentSearches')}
                </h3>
                <button
                  onClick={() => {
                    clearSearchHistory();
                    setSearchHistory([]);
                    setShowHistory(false);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-color-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title={t('clearHistory')}
                >
                  <Trash2 size={14} />
                  {t('clear')}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {searchHistory.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--light-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.backgroundColor = 'var(--white)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.backgroundColor = 'var(--light-color)';
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setQuery(item.query);
                        setShowHistory(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flex: 1,
                        minWidth: 0,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        padding: 0
                      }}
                    >
                      <Clock size={16} color="var(--text-color-secondary)" style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.query}
                      </span>
                      {item.resultCount !== undefined && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-color-secondary)', flexShrink: 0 }}>
                          {item.resultCount} {t('results')}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSearchHistoryItem(item.query);
                        setSearchHistory(getSearchHistory());
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-color-secondary)',
                        flexShrink: 0
                      }}
                      title={t('removeFromHistory')}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 显示热门搜索 */}
          {!hasSearched && !query.trim() && !showHistory && popularSearches.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={16} color="var(--primary-color)" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color-secondary)', margin: 0 }}>
                  {t('popularSearches')}
                </h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {popularSearches.map((popular, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(popular);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'var(--light-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.backgroundColor = 'var(--white)';
                      e.currentTarget.style.color = 'var(--primary-color)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.backgroundColor = 'var(--light-color)';
                      e.currentTarget.style.color = 'var(--text-color)';
                    }}
                  >
                    {popular}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 显示提示信息 */}
          {!hasSearched && !query.trim() && !showHistory && popularSearches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
              {t('startTyping')}
            </div>
          )}

          {/* 显示搜索结果 */}
          {hasSearched && results && (
            <SearchResults results={results} onResultClick={onClose} />
          )}

          {hasSearched && results && results.total === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-color-secondary)' }}>
              {t('noResults')}
            </div>
          )}
        </div>

        {/* 快捷键提示 */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-color-secondary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>{t('shortcutHint')}</span>
          {results && results.total > 0 && (
            <span>{t('resultsCount', { count: results.total })}</span>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
