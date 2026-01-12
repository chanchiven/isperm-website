'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { Search, X } from 'lucide-react';
import { SearchModal } from './SearchModal';

/**
 * 搜索栏组件
 * 显示搜索图标，点击打开搜索模态框
 */
export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();

  // 键盘快捷键支持 (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="search-button"
        aria-label="Search"
        type="button"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-color)',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--primary-color)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-color)';
        }}
      >
        <Search size={20} />
      </button>

      {isOpen && (
        <SearchModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          locale={locale}
        />
      )}
    </>
  );
}
