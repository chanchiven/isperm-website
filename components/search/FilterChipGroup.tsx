'use client';

import {memo, ReactNode} from 'react';
import {filterLabelStyle} from './searchModalStyles';

interface FilterChipGroupProps {
  label: string;
  children: ReactNode;
  wrap?: boolean;
}

export const FilterChipGroup = memo(function FilterChipGroup({
  label,
  children,
  wrap = true
}: FilterChipGroupProps) {
  return (
    <div>
      <label style={filterLabelStyle}>{label}</label>
      <div style={{display: 'flex', flexWrap: wrap ? 'wrap' : undefined, gap: '0.5rem'}}>
        {children}
      </div>
    </div>
  );
});
