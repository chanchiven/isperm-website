'use client';

import {memo} from 'react';
import {chipStyle} from './searchModalStyles';

interface FilterChipButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  rounded?: 'pill' | 'square';
}

export const FilterChipButton = memo(function FilterChipButton({
  label,
  selected,
  onClick,
  rounded = 'pill'
}: FilterChipButtonProps) {
  return (
    <button type="button" onClick={onClick} style={chipStyle(selected, rounded)}>
      {label}
    </button>
  );
});
