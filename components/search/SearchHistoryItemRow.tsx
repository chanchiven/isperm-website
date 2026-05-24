'use client';

import {memo, useCallback} from 'react';
import {Clock, X} from 'lucide-react';
import {SearchHistoryItem as HistoryItem} from '@/lib/search/history';
import {
  historyCountStyle,
  historyQueryStyle,
  historyRemoveButtonStyle,
  historySelectButtonStyle
} from './searchModalStyles';

interface SearchHistoryItemProps {
  item: HistoryItem;
  resultsLabel: string;
  removeTitle: string;
  onSelect: (query: string) => void;
  onRemove: (query: string) => void;
}

export const SearchHistoryItemRow = memo(function SearchHistoryItemRow({
  item,
  resultsLabel,
  removeTitle,
  onSelect,
  onRemove
}: SearchHistoryItemProps) {
  const handleSelect = useCallback(() => onSelect(item.query), [item.query, onSelect]);
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onRemove(item.query);
    },
    [item.query, onRemove]
  );

  return (
    <div className="search-modal-history-item">
      <button type="button" onClick={handleSelect} style={historySelectButtonStyle}>
        <Clock size={16} color="var(--text-color-secondary)" style={{flexShrink: 0}} />
        <span style={historyQueryStyle}>{item.query}</span>
        {item.resultCount !== undefined && (
          <span style={historyCountStyle}>
            {item.resultCount} {resultsLabel}
          </span>
        )}
      </button>
      <button type="button" onClick={handleRemove} style={historyRemoveButtonStyle} title={removeTitle}>
        <X size={14} />
      </button>
    </div>
  );
});
