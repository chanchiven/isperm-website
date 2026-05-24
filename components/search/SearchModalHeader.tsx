'use client';

import {memo, Ref} from 'react';
import {Search, X, Loader2, Filter} from 'lucide-react';
import {headerStyle, inputStyle} from './searchModalStyles';

interface SearchModalHeaderProps {
  inputRef: Ref<HTMLInputElement>;
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  isLoading: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  filtersTitle: string;
  onClose: () => void;
}

export const SearchModalHeader = memo(function SearchModalHeader({
  inputRef,
  query,
  onQueryChange,
  placeholder,
  isLoading,
  showFilters,
  onToggleFilters,
  filtersTitle,
  onClose
}: SearchModalHeaderProps) {
  return (
    <div style={headerStyle}>
      <Search size={20} color="var(--text-color)" style={{flexShrink: 0}} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {isLoading && (
        <Loader2 size={20} color="var(--primary-color)" className="search-spinner" />
      )}
      <button
        type="button"
        onClick={onToggleFilters}
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
        title={filtersTitle}
      >
        <Filter size={18} />
      </button>
      <button
        type="button"
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
  );
});
