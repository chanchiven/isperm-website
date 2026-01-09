'use client';

import {useState, useEffect, useRef} from 'react';
import {Link} from '@/i18n/routing';
import {useTranslations, useLocale} from 'next-intl';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';

/**
 * 客户端导航组件，确保正确保留当前语言
 * 使用 useTranslations hook 获取翻译，不依赖服务端组件的 t 函数
 * 包含移动端汉堡菜单功能
 */
export function Navigation() {
  // 使用 useTranslations hook 获取翻译
  // 使用 'index' namespace，因为所有页面都有 nav 键
  const t = useTranslations('index');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // 切换菜单状态
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 关闭菜单
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // 添加事件监听器
      document.addEventListener('mousedown', handleClickOutside);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // 监听路由变化，关闭菜单（Next.js 路由变化时）
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };
    
    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <Link href="/" locale={locale as any} onClick={closeMenu}>
              iSperm<span className="logo-medical">Medical</span>
            </Link>
          </div>
          
          {/* 汉堡菜单按钮 */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? t('nav.closeMenu') || 'Close menu' : t('nav.openMenu') || 'Open menu'}
            aria-expanded={isMenuOpen}
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          {/* 导航菜单 */}
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li><Link href="/" locale={locale as any} onClick={closeMenu}>{t('nav.home')}</Link></li>
            <li><Link href="/products" locale={locale as any} onClick={closeMenu}>{t('nav.products')}</Link></li>
            <li><Link href="/about" locale={locale as any} onClick={closeMenu}>{t('nav.about')}</Link></li>
            <li><Link href="/faq" locale={locale as any} onClick={closeMenu}>{t('nav.knowledgeHub')}</Link></li>
            <li><Link href="/contact" locale={locale as any} onClick={closeMenu}>{t('nav.contact')}</Link></li>
          </ul>
          
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
