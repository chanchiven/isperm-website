'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {HoverableDiv} from '@/components/HoverableDiv';
import {HoverableLink} from '@/components/HoverableLink';
import {useState, useEffect} from 'react';

export default function ContactPage() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    productInterest: '',
    message: '',
    website: '' // Honeypot field - should remain empty
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: if the honeypot field is filled, it's likely a bot
    if (formData.website) {
      // Silently reject - don't submit the form
      return;
    }

    // Client-side validation
    const newErrors: {name?: string; email?: string} = {};
    if (!formData.name.trim()) {
      newErrors.name = t('form.errors.nameRequired');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.errors.emailInvalid');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 优先使用 Formspree，如果没有配置则使用默认值或 Web3Forms
      // 默认使用表单 ID: meeejqka (https://formspree.io/f/meeejqka)
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'meeejqka';
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      
      let response: Response;
      
      // 优先使用 Formspree（默认值确保表单总是可用）
      if (formspreeId) {
        // 使用 Formspree
        response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            company: formData.company,
            email: formData.email,
            productInterest: formData.productInterest || 'Not specified',
            message: formData.message,
            _replyto: formData.email, // Formspree 使用 _replyto 设置回复地址
          }),
        });
      } else if (web3formsKey) {
        // 使用 Web3Forms（备选方案）
        response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: 'New Inquiry from iSperm Website',
            name: formData.name,
            company: formData.company,
            email: formData.email,
            productInterest: formData.productInterest || 'Not specified',
            message: formData.message,
            from_name: formData.name,
            // Web3Forms 会自动发送到配置的邮箱
          }),
        });
      } else {
        // 如果都没有配置，显示错误（实际上不应该到达这里，因为有默认值）
        throw new Error('Form service not configured. Please set NEXT_PUBLIC_FORMSPREE_ID or NEXT_PUBLIC_WEB3FORMS_KEY');
      }

      if (response.ok) {
        const result = await response.json();
        // Formspree 和 Web3Forms 都返回 success 状态
        if (result.success !== false) {
          setSubmitStatus('success');
          // Reset form
          setFormData({
            name: '',
            company: '',
            email: '',
            productInterest: '',
            message: '',
            website: ''
          });
          // Reset status after 5 seconds
          setTimeout(() => setSubmitStatus('idle'), 5000);
        } else {
          setSubmitStatus('error');
          setTimeout(() => setSubmitStatus('idle'), 5000);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Form submission error:', errorData);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{background: '#FFFFFF', minHeight: '100vh'}}>
      {/* Navigation */}
      <Navigation />

      {/* Action Cards */}
      <section style={{
        padding: '120px 0',
        background: '#FFFFFF'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
          className="action-cards-grid">
            {/* Card A: Become a Global Partner */}
            <HoverableDiv style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
            hoverStyle={{
              boxShadow: '0 4px 12px rgba(0, 155, 148, 0.15)',
              transform: 'translateY(-4px)'
            }}
            defaultStyle={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(0)'
            }}>
              <div style={{flex: '1'}}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#00776E',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17 20H22V18C22 16.3431 20.6569 15 19 15C18.0444 15 17.1931 15.4468 16.6438 16.1429M17 20H7M17 20V18C17 15.2386 14.7614 13 12 13C9.23858 13 7 15.2386 7 18V20M7 20H2V18C2 16.3431 3.34315 15 5 15C5.95561 15 6.80686 15.4468 7.35625 16.1429M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '1rem',
                  minHeight: isMobile ? 'auto' : '4.32rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {t('actionCards.partner.title')}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666666',
                  lineHeight: '1.6',
                  marginBottom: 0,
                  minHeight: isMobile ? 'auto' : '5.5rem'
                }}>
                  {t('actionCards.partner.description')}
                </p>
              </div>
              <div style={{marginTop: '2rem'}}>
                <HoverableLink 
                  href={`mailto:market@isperm.com?subject=${encodeURIComponent(t('actionCards.partner.emailSubject'))}`}
                  style={{
                    display: 'inline-block',
                    background: '#00776E',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.875rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                  hoverStyle={{
                    background: '#008080',
                    transform: 'translateY(-2px)'
                  }}
                  defaultStyle={{
                    background: '#00776E',
                    transform: 'translateY(0)'
                  }}
                >
                  {t('actionCards.button')}
                </HoverableLink>
              </div>
            </HoverableDiv>

            {/* Card B: Get Professional Consultation */}
            <HoverableDiv style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
            hoverStyle={{
              boxShadow: '0 4px 12px rgba(0, 155, 148, 0.15)',
              transform: 'translateY(-4px)'
            }}
            defaultStyle={{
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(0)'
            }}>
              <div style={{flex: '1'}}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: '#00776E',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 2rem'
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  fontWeight: 600,
                  color: '#333333',
                  marginBottom: '1rem',
                  minHeight: isMobile ? 'auto' : '4.32rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {t('actionCards.consultation.title')}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#666666',
                  lineHeight: '1.6',
                  marginBottom: 0,
                  minHeight: isMobile ? 'auto' : '5.5rem'
                }}>
                  {t('actionCards.consultation.description')}
                </p>
              </div>
              <div style={{marginTop: '2rem'}}>
                <HoverableLink 
                  href={`mailto:market@isperm.com?subject=${encodeURIComponent(t('actionCards.consultation.emailSubject'))}`}
                  style={{
                    display: 'inline-block',
                    background: '#00776E',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '0.875rem 2rem',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                  hoverStyle={{
                    background: '#008080',
                    transform: 'translateY(-2px)'
                  }}
                  defaultStyle={{
                    background: '#00776E',
                    transform: 'translateY(0)'
                  }}
                >
                  {t('actionCards.button')}
                </HoverableLink>
              </div>
            </HoverableDiv>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '120px 0',
        background: '#FFFFFF'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '4rem',
            maxWidth: '1200px',
            margin: '0 auto',
            alignItems: 'start'
          }}
          className="contact-form-grid">
            {/* Left: Email Info */}
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
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#00776E',
                  textDecoration: 'none',
                  display: 'block',
                  marginBottom: '1.5rem'
                }}
                hoverStyle={{ opacity: 0.8 }}
                defaultStyle={{ opacity: 1 }}
              >
                market@isperm.com
              </HoverableLink>
              <p style={{
                fontSize: '1rem',
                color: '#666666',
                lineHeight: '1.6',
                padding: '1rem',
                background: '#F8F9FA',
                borderRadius: '8px',
                borderLeft: '4px solid #00776E'
              }}>
                {t('form.responsePromise')}
              </p>
            </div>

            {/* Right: Contact Form */}
            <div>
              <form onSubmit={handleSubmit} style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '2.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                position: 'relative'
              }}>
                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    marginBottom: '0.5rem'
                  }}>
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.name) setErrors({...errors, name: undefined});
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.name ? '1px solid #EF4444' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.name && (
                    <span style={{color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    marginBottom: '0.5rem'
                  }}>
                    {t('form.company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    marginBottom: '0.5rem'
                  }}>
                    {t('form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                      if (errors.email) setErrors({...errors, email: undefined});
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: errors.email ? '1px solid #EF4444' : '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  {errors.email && (
                    <span style={{color: '#EF4444', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>
                      {errors.email}
                    </span>
                  )}
                </div>

                <div style={{marginBottom: '1.5rem'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    marginBottom: '0.5rem'
                  }}>
                    {t('form.productInterest')}
                  </label>
                  <select
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      background: '#FFFFFF'
                    }}
                  >
                    <option value="">{t('form.selectProduct')}</option>
                    <option value="human">{t('form.humanProducts')}</option>
                    <option value="animal">{t('form.animalProducts')}</option>
                  </select>
                </div>

                <div style={{marginBottom: '2rem'}}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#333333',
                    marginBottom: '0.5rem'
                  }}>
                    {t('form.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Honeypot field - hidden from users but visible to bots */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    opacity: 0,
                    pointerEvents: 'none'
                  }}
                  aria-hidden="true"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: isSubmitting ? '#cccccc' : '#00776E',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 600,
                    padding: '1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = '#008080';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.background = '#00776E';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isSubmitting ? t('form.submitting') : t('form.submitButton')}
                </button>

                {submitStatus === 'success' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#d4edda',
                    color: '#155724',
                    borderRadius: '8px',
                    border: '1px solid #c3e6cb',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }}>
                    {t('form.successMessage') || 'Thank you! Your message has been sent successfully.'}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '8px',
                    border: '1px solid #f5c6cb',
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }}>
                    {t('form.errorMessage') || 'Sorry, there was an error sending your message. Please try again or contact us directly at market@isperm.com'}
                  </div>
                )}
              </form>

              {/* Trust Icons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '3rem',
                marginTop: '3rem',
                opacity: 0.7
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#666666" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 9" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{color: '#666666', fontSize: '0.9rem', fontWeight: 500}}>
                    {t('trust.globalSupport')}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="#666666" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span style={{color: '#666666', fontSize: '0.9rem', fontWeight: 500}}>
                    {t('trust.response24h')}
                  </span>
                </div>
              </div>
            </div>
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
}
