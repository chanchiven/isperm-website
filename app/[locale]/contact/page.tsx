import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {HoverableLink} from '@/components/HoverableLink';
import {ContactForm} from '@/components/ContactForm';
import {ContactActionCard} from '@/components/contact/ContactActionCard';

export default async function ContactPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in ContactPage');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in ContactPage');
    }
    const {locale} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'contact'});

    return (
      <div style={{background: '#FFFFFF', minHeight: '100vh'}}>
        <Navigation />

        <section style={{
          padding: '200px 0 3rem',
          background: '#FFFFFF',
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              color: '#333333',
              marginBottom: '0.5rem'
            }}>
              {t('hero.title')}
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: '#666666',
              margin: 0
            }}>
              {t('hero.subtitle')}
            </p>
          </div>
        </section>

        <section style={{
          padding: '120px 0',
          background: '#FFFFFF'
        }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                maxWidth: '1000px',
                margin: '0 auto'
              }}
              className="action-cards-grid"
            >
              <ContactActionCard
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 15.2386 14.7614 13 12 13C9.23858 13 7 15.2386 7 18V20M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title={t('actionCards.partner.title')}
                description={t('actionCards.partner.description')}
                mailtoHref={`mailto:market@isperm.com?subject=${encodeURIComponent(t('actionCards.partner.emailSubject'))}`}
                buttonText={t('actionCards.button')}
              />
              <ContactActionCard
                icon={
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
                title={t('actionCards.consultation.title')}
                description={t('actionCards.consultation.description')}
                mailtoHref={`mailto:market@isperm.com?subject=${encodeURIComponent(t('actionCards.consultation.emailSubject'))}`}
                buttonText={t('actionCards.button')}
              />
            </div>
          </div>
        </section>

        <section style={{
          padding: '120px 0',
          background: '#FFFFFF'
        }}>
          <div className="container">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.5fr',
                gap: '4rem',
                maxWidth: '1200px',
                margin: '0 auto',
                alignItems: 'start'
              }}
              className="contact-form-grid"
            >
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '1.5rem'
                }}>
                  {t('form.emailTitle')}
                </h3>
                <HoverableLink
                  href="mailto:market@isperm.com"
                  variant="email-link"
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#00776E',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: '1.5rem'
                  }}
                >
                  market@isperm.com
                </HoverableLink>
              </div>

              <ContactForm />
            </div>
          </div>
        </section>


        <Footer locale={locale} />
      </div>
    );
  } catch (error) {
    console.error('Error in ContactPage:', error);
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}
