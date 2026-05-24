'use client';

import {memo} from 'react';
import type {LanguageOption} from './languageConstants';

interface LanguageSwitcherMenuProps {
  isOpen: boolean;
  languages: readonly LanguageOption[];
  displayName: string;
  displayLocale: string;
  showActiveState: boolean;
  onToggle: () => void;
  onSelect: (code: string) => void;
}

export const LanguageSwitcherMenu = memo(function LanguageSwitcherMenu({
  isOpen,
  languages,
  displayName,
  displayLocale,
  showActiveState,
  onToggle,
  onSelect
}: LanguageSwitcherMenuProps) {
  return (
    <>
      <button
        className="lang-toggle"
        id="langToggle"
        aria-label="Select language"
        onClick={onToggle}
        type="button"
      >
        <span id="currentLang">{displayName}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div className={`lang-menu ${isOpen ? 'active' : ''}`} id="langMenu">
        {languages.map((lang) => (
          <a
            key={lang.code}
            href="#"
            className={`lang-option ${showActiveState && displayLocale === lang.code ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(lang.code);
            }}
          >
            <span className="lang-option-label">{lang.name}</span>
          </a>
        ))}
      </div>
    </>
  );
});
