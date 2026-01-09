'use client';

import {useLocale} from 'next-intl';
import {useState, useEffect, useRef} from 'react';
import {routing} from '@/i18n/routing';

// 固定的语言列表，确保服务器端和客户端一致
const ALL_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'bg', name: 'Български' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português' },
  { code: 'ro', name: 'Română' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'uk', name: 'Українська' },
  { code: 'vi', name: 'Tiếng Việt' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLangName, setCurrentLangName] = useState('English');
  const [clientLocale, setClientLocale] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 在客户端 hydration 后更新 locale 和语言名称，避免 hydration 不匹配
  useEffect(() => {
    setMounted(true);
    
    // 从 URL 路径中获取 locale，确保与服务器端一致
    let detectedLocale = locale;
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0 && routing.locales.includes(pathSegments[0] as any)) {
        detectedLocale = pathSegments[0];
      }
    }
    
    // 在客户端更新 locale 和语言名称
    setClientLocale(detectedLocale);
    const langName = ALL_LANGUAGES.find(lang => lang.code === detectedLocale)?.name || 'English';
    setCurrentLangName(langName);
  }, [locale]);

  const switchLanguage = (newLocale: string) => {
    // 如果已经是当前语言，不进行切换
    if (newLocale === locale) {
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

  // 使用固定的语言列表，确保服务器端和客户端完全一致
  const languages = ALL_LANGUAGES;

  // 服务器端和客户端初始渲染时都使用相同的默认值，避免 hydration 不匹配
  // 只在客户端 hydration 完成后才显示实际的语言名称和 active 状态
  if (!mounted) {
    return (
      <div className="language-selector" ref={menuRef}>
        <button 
          className="lang-toggle" 
          id="langToggle" 
          aria-label="Select language"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span id="currentLang">
            English
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
              className="lang-option"
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

  return (
    <div className="language-selector" ref={menuRef}>
      <button 
        className="lang-toggle" 
        id="langToggle" 
        aria-label="Select language"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span id="currentLang">
          {currentLangName}
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
            className={`lang-option ${clientLocale !== null && clientLocale === lang.code ? 'active' : ''}`}
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

