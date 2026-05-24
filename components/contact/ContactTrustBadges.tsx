'use client';

import {memo} from 'react';
import {useTranslations} from 'next-intl';

export const ContactTrustBadges = memo(function ContactTrustBadges() {
  const t = useTranslations('contact');

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      marginTop: '3rem',
      opacity: 0.7
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#666666" strokeWidth="2"/>
          <path d="M8 12L11 15L16 9" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{color: '#666666', fontSize: '0.9rem', fontWeight: 500}}>
          {t('trust.globalSupport')}
        </span>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#666666" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{color: '#666666', fontSize: '0.9rem', fontWeight: 500}}>
          {t('trust.response24h')}
        </span>
      </div>
    </div>
  );
});
