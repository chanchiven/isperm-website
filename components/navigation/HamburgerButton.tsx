'use client';

import {memo} from 'react';

interface HamburgerButtonProps {
  isOpen: boolean;
  openLabel: string;
  closeLabel: string;
  onToggle: () => void;
}

export const HamburgerButton = memo(function HamburgerButton({
  isOpen,
  openLabel,
  closeLabel,
  onToggle
}: HamburgerButtonProps) {
  return (
    <button
      className={`hamburger ${isOpen ? 'active' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? closeLabel : openLabel}
      aria-expanded={isOpen}
      type="button"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
});
