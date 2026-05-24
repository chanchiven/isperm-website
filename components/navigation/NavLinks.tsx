'use client';

import {memo} from 'react';
import {Link} from '@/i18n/routing';

interface NavLinkItem {
  href: '/' | '/products' | '/about' | '/faq' | '/contact';
  label: string;
}

interface NavLinksProps {
  locale: string;
  isOpen: boolean;
  links: NavLinkItem[];
  onNavigate: () => void;
}

export const NavLinks = memo(function NavLinks({
  locale,
  isOpen,
  links,
  onNavigate
}: NavLinksProps) {
  return (
    <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
      {links.map(({href, label}) => (
        <li key={href}>
          <Link href={href} locale={locale as any} onClick={onNavigate}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
});
