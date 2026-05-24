import type {CSSProperties} from 'react';

export const overlayStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '10vh',
  padding: '2rem'
};

export const modalStyle: CSSProperties = {
  backgroundColor: 'var(--white)',
  borderRadius: '12px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  width: '100%',
  maxWidth: '700px',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 9999,
  overflow: 'hidden'
};

export const headerStyle: CSSProperties = {
  padding: '1.5rem',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
};

export const inputStyle: CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: '1rem',
  color: 'var(--text-color)',
  background: 'transparent'
};

export const bodyStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '1rem'
};

export const footerStyle: CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderTop: '1px solid var(--border-color)',
  fontSize: '0.875rem',
  color: 'var(--text-color-secondary)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-color-secondary)',
  margin: 0
};

export const filterPanelStyle: CSSProperties = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid var(--border-color)',
  backgroundColor: 'var(--light-color)'
};

export const filterLabelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-color-secondary)',
  marginBottom: '0.5rem',
  display: 'block'
};

export function chipStyle(selected: boolean, rounded: 'pill' | 'square' = 'pill'): CSSProperties {
  return {
    padding: '0.375rem 0.75rem',
    background: selected ? 'var(--primary-color)' : 'var(--white)',
    border: `1px solid ${selected ? 'var(--primary-color)' : 'var(--border-color)'}`,
    borderRadius: rounded === 'pill' ? '20px' : '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: selected ? 'var(--white)' : 'var(--text-color)',
    transition: 'all 0.2s ease'
  };
}

export const historyHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
};

export const historyClearButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  fontSize: '0.75rem',
  color: 'var(--text-color-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem'
};

export const historyListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

export const historySelectButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flex: 1,
  minWidth: 0,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  padding: 0
};

export const historyQueryStyle: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export const historyCountStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-color-secondary)',
  flexShrink: 0
};

export const historyRemoveButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--text-color-secondary)',
  flexShrink: 0
};

export const clearFiltersButtonStyle: CSSProperties = {
  padding: '0.5rem',
  background: 'transparent',
  border: '1px solid var(--border-color)',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: 'var(--text-color-secondary)',
  transition: 'all 0.2s ease',
  alignSelf: 'flex-start'
};

export const filterGroupStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem'
};

export const filterRowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

export const searchCenterPanelStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4rem 2rem'
};

export const searchQueryIntroStyle: CSSProperties = {
  fontSize: '1.125rem',
  color: 'var(--text-color-secondary)',
  marginBottom: '2rem'
};
