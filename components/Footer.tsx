import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {Facebook, Linkedin} from 'lucide-react';

const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/isperm/',
  facebook: 'https://www.facebook.com/profile.php?id=61579351030352',
} as const;

export async function Footer({locale}: {locale: string}) {
  const t = await getTranslations({locale, namespace: 'index'});

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>{t('footer.company')}</h3>
            <p>{t('footer.description')}</p>
            <div className="footer-social">
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-social-link"
              >
                <Linkedin size={20} strokeWidth={2} />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-link"
              >
                <Facebook size={20} strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>{t('footer.quickLinks')}</h4>
            <ul>
              <li><Link href="/" locale={locale as any}>{t('nav.home')}</Link></li>
              <li><Link href="/products" locale={locale as any}>{t('nav.products')}</Link></li>
              <li><Link href="/about" locale={locale as any}>{t('nav.about')}</Link></li>
              <li><Link href="/faq" locale={locale as any}>{t('nav.knowledgeHub')}</Link></li>
              <li><Link href="/contact" locale={locale as any}>{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <p>{t('footer.email')} <a href="mailto:market@isperm.com">market@isperm.com</a></p>
            <p>{t('footer.address')} {t('footer.fullAddress')}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
