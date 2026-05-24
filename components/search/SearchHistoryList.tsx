'use client';

import {memo, useCallback} from 'react';
import {Trash2} from 'lucide-react';
import {SearchHistoryItem} from '@/lib/search/history';
import {clearSearchHistory, getSearchHistory, removeSearchHistoryItem} from '@/lib/search/history';
import {SearchHistoryItemRow} from './SearchHistoryItemRow';
import {
  historyClearButtonStyle,
  historyHeaderStyle,
  historyListStyle,
  sectionTitleStyle
} from './searchModalStyles';

interface SearchHistoryListProps {
  history: SearchHistoryItem[];
  recentTitle: string;
  clearLabel: string;
  clearTitle: string;
  resultsLabel: string;
  removeTitle: string;
  onSelect: (query: string) => void;
  onHistoryChange: (history: SearchHistoryItem[]) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export const SearchHistoryList = memo(function SearchHistoryList({
  history,
  recentTitle,
  clearLabel,
  clearTitle,
  resultsLabel,
  removeTitle,
  onSelect,
  onHistoryChange,
  onVisibilityChange
}: SearchHistoryListProps) {
  const handleClear = useCallback(() => {
    clearSearchHistory();
    onHistoryChange([]);
    onVisibilityChange(false);
  }, [onHistoryChange, onVisibilityChange]);

  const handleRemove = useCallback(
    (query: string) => {
      removeSearchHistoryItem(query);
      onHistoryChange(getSearchHistory());
    },
    [onHistoryChange]
  );

  if (history.length === 0) return null;

  return (
    <div>
      <div style={historyHeaderStyle}>
        <h3 style={sectionTitleStyle}>{recentTitle}</h3>
        <button type="button" onClick={handleClear} style={historyClearButtonStyle} title={clearTitle}>
          <Trash2 size={14} />
          {clearLabel}
        </button>
      </div>
      <div style={historyListStyle}>
        {history.slice(0, 10).map((item) => (
          <SearchHistoryItemRow
            key={item.query + item.timestamp}
            item={item}
            resultsLabel={resultsLabel}
            removeTitle={removeTitle}
            onSelect={onSelect}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
});
