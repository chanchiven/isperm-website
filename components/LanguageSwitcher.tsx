'use client';

import {useLocale} from 'next-intl';
import {useState, useEffect, useRef} from 'react';
import {routing} from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // 直接使用 useLocale() 返回的值，确保服务器端和客户端一致
  const currentLocale = locale;

  const switchLanguage = (newLocale: string) => {
    // 如果已经是当前语言，不进行切换
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }
    
    // 获取当前路径
    const currentPath = window.location.pathname;
    
    // 将路径分割成段
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    // 如果第一段是语言代码，移除它
    if (pathSegments.length > 0 && routing.locales.includes(pathSegments[0] as any)) {
      pathSegments.shift(); // 移除语言代码
    }
    
    // 构建新的路径
    // 如果还有剩余路径段，组合它们；否则使用根路径
    const remainingPath = pathSegments.length > 0 ? '/' + pathSegments.join('/') : '';
    const newPath = `/${newLocale}${remainingPath}`;
    
    // 保留查询参数和hash
    const search = window.location.search;
    const hash = window.location.hash;
    const newUrl = newPath + search + hash;
    
    // 使用 window.location.replace 强制刷新页面，避免缓存问题
    // 这样可以确保页面完全重新加载，加载正确的语言
    window.location.replace(newUrl);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // English first, then sort the rest alphabetically by language name
  const allLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'fr', name: 'Français' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'uk', name: 'Українська' },
    { code: 'bg', name: 'Български' },
    { code: 'ro', name: 'Română' }
  ];
  
  // Separate English from others, then sort others alphabetically
  const englishLang = allLanguages.find(lang => lang.code === 'en') || allLanguages[0];
  const otherLanguages = allLanguages
    .filter(lang => lang.code !== 'en')
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const languages = [englishLang, ...otherLanguages];

  return (
    <div className="language-selector" ref={menuRef}>
      <button 
        className="lang-toggle" 
        id="langToggle" 
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span id="currentLang" suppressHydrationWarning>
          {languages.find(lang => lang.code === currentLocale)?.name || 'English'}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      <div className={`lang-menu ${isOpen ? 'active' : ''}`} id="langMenu">
        {languages.map((lang) => (
          <a
            key={lang.code}
            href="#"
            className={`lang-option ${currentLocale === lang.code ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              switchLanguage(lang.code);
            }}
          >
            <span style={{whiteSpace: 'nowrap'}}>{lang.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

