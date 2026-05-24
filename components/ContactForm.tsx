'use client';

import {useTranslations} from 'next-intl';
import {ContactFormField} from './contact/ContactFormField';
import {ContactTrustBadges} from './contact/ContactTrustBadges';
import {useContactForm} from './contact/useContactForm';
import {formStyle, statusBoxStyle, inputStyle} from './contact/contactFormStyles';

export function ContactForm() {
  const t = useTranslations('contact');
  const {
    formData,
    isSubmitting,
    submitStatus,
    errors,
    handleChange,
    handleSubmit,
    clearFieldError
  } = useContactForm();

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <ContactFormField
          label={t('form.name')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          onClearError={() => clearFieldError('name')}
          required
        />

        <ContactFormField
          label={t('form.company')}
          name="company"
          value={formData.company}
          onChange={handleChange}
        />

        <ContactFormField
          label={t('form.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          onClearError={() => clearFieldError('email')}
          required
        />

        <ContactFormField
          label={t('form.productInterest')}
          name="productInterest"
          value={formData.productInterest}
          onChange={handleChange}
        >
          <select
            name="productInterest"
            value={formData.productInterest}
            onChange={handleChange}
            style={{
              ...inputStyle(),
              background: '#FFFFFF'
            }}
          >
            <option value="">{t('form.selectProduct')}</option>
            <option value="human">{t('form.humanProducts')}</option>
            <option value="animal">{t('form.animalProducts')}</option>
          </select>
        </ContactFormField>

        <ContactFormField
          label={t('form.message')}
          name="message"
          value={formData.message}
          onChange={handleChange}
          multiline
        />

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
          className="contact-submit-btn"
        >
          {isSubmitting ? t('form.submitting') : t('form.submitButton')}
        </button>

        {submitStatus === 'success' && (
          <div style={statusBoxStyle('success')}>
            {t('form.successMessage') || 'Thank you! Your message has been sent successfully.'}
          </div>
        )}

        {submitStatus === 'error' && (
          <div style={statusBoxStyle('error')}>
            {t('form.errorMessage') || 'Sorry, there was an error sending your message. Please try again or contact us directly at market@isperm.com'}
          </div>
        )}
      </form>

      <ContactTrustBadges />
    </div>
  );
}
