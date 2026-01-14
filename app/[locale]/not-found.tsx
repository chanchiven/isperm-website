import {getTranslations} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params?: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    // 处理静态导出时 params 可能为 undefined 的情况
    let locale = 'en'; // 默认语言
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams && resolvedParams.locale) {
        locale = resolvedParams.locale;
      }
    }
    const t = await getTranslations({locale, namespace: 'index'});
    
    return {
      title: t('notFound.title'),
      description: t('notFound.description'),
      alternates: generateHreflangAlternates('/404'),
    };
  } catch (error) {
    console.error('Error in not-found generateMetadata:', error);
    return {
      title: '404 - Page Not Found | iSperm Medical',
      description: 'The page you are looking for does not exist.',
    };
  }
}

export default async function NotFoundPage({
  params
}: {
  params?: Promise<{locale: string}>;
}) {
  try {
    // 处理静态导出时 params 可能为 undefined 的情况
    let locale = 'en'; // 默认语言
    if (params) {
      const resolvedParams = await params;
      if (resolvedParams && resolvedParams.locale) {
        locale = resolvedParams.locale;
      }
    }
    const t = await getTranslations({locale, namespace: 'index'});
  
  return (
    <div>
      <Navigation />
      
      {/* 404 Content */}
      <section style={{
        padding: '120px 0',
        background: 'var(--light-color)',
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container" style={{textAlign: 'center'}}>
          <h1 style={{
            fontSize: '8rem',
            fontWeight: 700,
            color: 'var(--primary-color)',
            marginBottom: '1rem',
            lineHeight: 1
          }}>
            {t('notFound.statusCode')}
          </h1>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            color: 'var(--dark-color)',
            marginBottom: '1.5rem',
            lineHeight: 1.3
          }}>
            {t('notFound.title')}
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-light)',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}>
            {t('notFound.description')}
          </p>
          
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link 
              href="/" 
              locale={locale as any}
              className="btn btn-primary"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                textDecoration: 'none'
              }}
            >
              {t('notFound.backToHome')}
            </Link>
            
            <Link 
              href="/products" 
              locale={locale as any}
              className="btn btn-outline"
              style={{
                padding: '14px 32px',
                fontSize: '1rem',
                textDecoration: 'none'
              }}
            >
              {t('nav.products')}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>{t('footer.company')}</h3>
              <p>{t('footer.description')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('footer.quickLinks')}</h4>
              <ul>
                <li><Link href="/" locale={locale as any}>{t('nav.home')}</Link></li>
                <li><Link href="/products" locale={locale as any}>{t('nav.products')}</Link></li>
                <li><Link href="/about" locale={locale as any}>{t('nav.about')}</Link></li>
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
    </div>
  );
  } catch (error) {
    console.error('Error in NotFoundPage:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
