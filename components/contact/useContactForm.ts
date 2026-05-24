'use client';

import {useState, useCallback} from 'react';
import {useTranslations} from 'next-intl';

export type ContactFormData = {
  name: string;
  company: string;
  email: string;
  productInterest: string;
  message: string;
  website: string;
};

const emptyForm: ContactFormData = {
  name: '',
  company: '',
  email: '',
  productInterest: '',
  message: '',
  website: ''
};

export function useContactForm() {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState<ContactFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const {name, value} = e.target;
      setFormData((prev) => ({...prev, [name]: value}));
    },
    []
  );

  const clearFieldError = useCallback((field: 'name' | 'email') => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return {...prev, [field]: undefined};
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (formData.website) return;

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
        const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'meeejqka';
        const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
        let response: Response;

        if (formspreeId) {
          response = await fetch(`https://formspree.io/f/${formspreeId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              company: formData.company,
              email: formData.email,
              productInterest: formData.productInterest || 'Not specified',
              message: formData.message,
              _replyto: formData.email
            })
          });
        } else if (web3formsKey) {
          response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({
              access_key: web3formsKey,
              subject: 'New Inquiry from iSperm Website',
              name: formData.name,
              company: formData.company,
              email: formData.email,
              productInterest: formData.productInterest || 'Not specified',
              message: formData.message,
              from_name: formData.name
            })
          });
        } else {
          throw new Error('Form service not configured');
        }

        if (response.ok) {
          const result = await response.json();
          if (result.success !== false) {
            setSubmitStatus('success');
            setFormData(emptyForm);
            setTimeout(() => setSubmitStatus('idle'), 5000);
          } else {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
          }
        } else {
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
    },
    [formData, t]
  );

  return {
    formData,
    isSubmitting,
    submitStatus,
    errors,
    handleChange,
    handleSubmit,
    clearFieldError
  };
}
