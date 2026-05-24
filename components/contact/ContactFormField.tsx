'use client';

import {memo, ReactNode} from 'react';
import {fieldGroupStyle, labelStyle, inputStyle, errorStyle} from './contactFormStyles';

interface ContactFormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  onClearError?: () => void;
  required?: boolean;
  type?: 'text' | 'email';
  multiline?: boolean;
  rows?: number;
  children?: ReactNode;
}

export const ContactFormField = memo(function ContactFormField({
  label,
  name,
  value,
  onChange,
  error,
  onClearError,
  required,
  type = 'text',
  multiline,
  rows = 5,
  children
}: ContactFormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e);
    onClearError?.();
  };

  return (
    <div style={{...fieldGroupStyle, marginBottom: multiline ? '2rem' : fieldGroupStyle.marginBottom}}>
      <label style={labelStyle}>
        {label}
        {required ? ' *' : ''}
      </label>
      {children ?? (multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={rows}
          style={{...inputStyle(!!error), resize: 'vertical'}}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          required={required}
          style={inputStyle(!!error)}
        />
      ))}
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
});
