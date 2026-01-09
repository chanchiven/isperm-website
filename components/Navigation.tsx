'use client';

import {Link} from '@/i18n/routing';
import {useTranslations, useLocale} from 'next-intl';
import {LanguageSwitcher} from '@/components/LanguageSwitcher';

/**
 * 客户端导航组件，确保正确保留当前语言
 * 使用 useTranslations hook 获取翻译，不依赖服务端组件的 t 函数
 */
export function Navigation() {
  // 使用 useTranslations hook 获取翻译
  // 使用 'index' namespace，因为所有页面都有 nav 键
  const t = useTranslations('index');
  const locale = useLocale();
  
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <Link href="/" locale={locale as any}>iSperm<span className="logo-medical">Medical</span></Link>
          </div>
          <ul className="nav-menu">
            <li><Link href="/" locale={locale as any}>{t('nav.home')}</Link></li>
            <li><Link href="/products" locale={locale as any}>{t('nav.products')}</Link></li>
            <li><Link href="/about" locale={locale as any}>{t('nav.about')}</Link></li>
            <li><Link href="/faq" locale={locale as any}>{t('nav.knowledgeHub')}</Link></li>
            <li><Link href="/contact" locale={locale as any}>{t('nav.contact')}</Link></li>
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
