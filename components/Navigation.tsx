'use client';

import {useMemo, useRef} from 'react';
import {Link} from '@/i18n/routing';
import {useTranslations, useLocale} from 'next-intl';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';
import {SearchBar} from '@/components/SearchBar';
import {HamburgerButton} from './navigation/HamburgerButton';
import {NavLinks} from './navigation/NavLinks';
import {useMobileNav} from './navigation/useMobileNav';

export function Navigation() {
  const t = useTranslations('index');
  const locale = useLocale();
  const navRef = useRef<HTMLElement>(null);
  const {isMenuOpen, toggleMenu, closeMenu} = useMobileNav(navRef);

  const navLinks = useMemo(
    () => [
      {href: '/' as const, label: t('nav.home')},
      {href: '/products' as const, label: t('nav.products')},
      {href: '/about' as const, label: t('nav.about')},
      {href: '/faq' as const, label: t('nav.knowledgeHub')},
      {href: '/contact' as const, label: t('nav.contact')}
    ],
    [t]
  );

  return (
    <nav className="navbar" ref={navRef}>
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <Link href="/" locale={locale as any} onClick={closeMenu}>
              <img
                src="/iSperm LOGO.svg"
                alt="iSperm Medical - CASA semen analyzer and sperm quality analyzer manufacturer"
                className="logo-image"
              />
            </Link>
          </div>
          <HamburgerButton
            isOpen={isMenuOpen}
            openLabel={t('nav.openMenu') || 'Open menu'}
            closeLabel={t('nav.closeMenu') || 'Close menu'}
            onToggle={toggleMenu}
          />
          <NavLinks locale={locale} isOpen={isMenuOpen} links={navLinks} onNavigate={closeMenu} />
          <div className="nav-actions">
            <SearchBar />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
