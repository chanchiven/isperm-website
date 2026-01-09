'use client';

import {useEffect} from 'react';
import {useLocale} from 'next-intl';

export function HtmlLangDir() {
  const locale = useLocale();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', locale);
    html.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  }, [locale]);

  return null;
}

