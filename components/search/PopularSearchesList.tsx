'use client';

import {memo} from 'react';
import {TrendingUp} from 'lucide-react';
import {sectionTitleStyle} from './searchModalStyles';

interface PopularSearchesListProps {
  items: string[];
  title: string;
  onSelect: (value: string) => void;
}

export const PopularSearchesList = memo(function PopularSearchesList({
  items,
  title,
  onSelect
}: PopularSearchesListProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem'}}>
        <TrendingUp size={16} color="var(--primary-color)" />
        <h3 style={sectionTitleStyle}>{title}</h3>
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="search-modal-popular-chip"
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
});
