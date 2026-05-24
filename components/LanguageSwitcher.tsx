'use client';

import {LanguageSwitcherMenu} from './language/LanguageSwitcherMenu';
import {useLanguageSwitcher} from './language/useLanguageSwitcher';

export function LanguageSwitcher() {
  const {
    menuRef,
    isOpen,
    toggleOpen,
    languages,
    displayName,
    displayLocale,
    showActiveState,
    switchLanguage
  } = useLanguageSwitcher();

  return (
    <div className="language-selector" ref={menuRef}>
      <LanguageSwitcherMenu
        isOpen={isOpen}
        languages={languages}
        displayName={displayName}
        displayLocale={displayLocale}
        showActiveState={showActiveState}
        onToggle={toggleOpen}
        onSelect={switchLanguage}
      />
    </div>
  );
}
