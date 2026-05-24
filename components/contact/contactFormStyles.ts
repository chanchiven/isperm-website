import type {CSSProperties} from 'react';

export const formStyle: CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '2.5rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  position: 'relative'
};

export const fieldGroupStyle: CSSProperties = {
  marginBottom: '1.5rem'
};

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: '#333333',
  marginBottom: '0.5rem'
};

export const inputStyle = (hasError?: boolean): CSSProperties => ({
  width: '100%',
  padding: '0.75rem',
  border: hasError ? '1px solid #EF4444' : '1px solid #E5E7EB',
  borderRadius: '8px',
  fontSize: '1rem',
  fontFamily: 'inherit'
});

export const errorStyle: CSSProperties = {
  color: '#EF4444',
  fontSize: '0.875rem',
  marginTop: '0.25rem',
  display: 'block'
};

export const statusBoxStyle = (type: 'success' | 'error'): CSSProperties => ({
  marginTop: '1rem',
  padding: '1rem',
  background: type === 'success' ? '#d4edda' : '#f8d7da',
  color: type === 'success' ? '#155724' : '#721c24',
  borderRadius: '8px',
  border: type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  fontSize: '0.9rem',
  textAlign: 'center'
});

export const actionCardStyle: CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '12px',
  padding: '3rem 2.5rem',
  textAlign: 'center',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column'
};

export const tealButtonStyle: CSSProperties = {
  display: 'inline-block',
  background: '#00776E',
  color: '#FFFFFF',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '0.875rem 2rem',
  borderRadius: '8px',
  textDecoration: 'none'
};

export const iconCircleStyle: CSSProperties = {
  width: '70px',
  height: '70px',
  background: '#00776E',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 2rem'
};

export const actionTitleStyle: CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 600,
  color: '#333333',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export const actionDescStyle: CSSProperties = {
  fontSize: '1rem',
  color: '#666666',
  lineHeight: '1.6',
  marginBottom: 0
};
