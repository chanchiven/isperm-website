'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {ALL_LANGUAGES, buildLocaleSwitchUrl, getLanguageName} from './languageConstants';

export function useLanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeLocale, setActiveLocale] = useState(locale);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const pathLocale = window.location.pathname.split('/').filter(Boolean)[0];
    if (pathLocale && routing.locales.includes(pathLocale as (typeof routing.locales)[number])) {
      setActiveLocale(pathLocale);
      return;
    }
    setActiveLocale(locale);
  }, [locale]);

  const switchLanguage = useCallback(
    (newLocale: string) => {
      if (newLocale === activeLocale) {
        setIsOpen(false);
        return;
      }

      const newPath = buildLocaleSwitchUrl(window.location.pathname, newLocale, routing.locales);
      const newUrl = newPath + window.location.search + window.location.hash;
      window.location.replace(newUrl);
      setIsOpen(false);
    },
    [activeLocale]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (!isOpen) return;
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = useCallback(() => setIsOpen((open) => !open), []);

  const displayLocale = mounted ? activeLocale : locale;
  const displayName = mounted ? getLanguageName(activeLocale) : 'English';

  return {
    menuRef,
    isOpen,
    toggleOpen,
    languages: ALL_LANGUAGES,
    displayName,
    displayLocale,
    showActiveState: mounted,
    switchLanguage
  };
}
