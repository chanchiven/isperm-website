'use client';

import {memo} from 'react';
import {Search, Sparkles} from 'lucide-react';
import {sectionTitleStyle} from './searchModalStyles';

interface SearchSuggestionsListProps {
  suggestions: string[];
  title: string;
  onSelect: (value: string) => void;
}

export const SearchSuggestionsList = memo(function SearchSuggestionsList({
  suggestions,
  title,
  onSelect
}: SearchSuggestionsListProps) {
  if (suggestions.length === 0) return null;

  return (
    <div style={{marginBottom: '1.5rem'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
        <Sparkles size={16} color="var(--primary-color)" />
        <h3 style={sectionTitleStyle}>{title}</h3>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="search-modal-list-item"
            onClick={() => onSelect(suggestion)}
          >
            <Search size={14} color="var(--text-color-secondary)" style={{marginRight: '0.75rem', flexShrink: 0}} />
            <span style={{flex: 1, textAlign: 'left'}}>{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
});
