import type {CSSProperties} from 'react';

export const articleCardStyle: CSSProperties = {
  background: 'var(--white)',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: 'var(--shadow)',
  border: '1px solid var(--border-color)',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%'
};

export const articleLinkStyle: CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
};

const wordBreakStyle: CSSProperties = {
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
  wordBreak: 'break-word',
  hyphens: 'auto'
};

export function getImageContainerStyle(fixedImageHeight: boolean): CSSProperties {
  if (fixedImageHeight) {
    return {
      width: '100%',
      height: '240px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--light-color)',
      padding: '1rem',
      flexShrink: 0,
      overflow: 'hidden'
    };
  }
  return {
    width: '100%',
    minHeight: '200px',
    maxHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--white)',
    padding: '1rem'
  };
}

export function getImageStyle(fixedImageHeight: boolean): CSSProperties {
  if (fixedImageHeight) {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%'
    };
  }
  return {
    width: '100%',
    height: 'auto',
    maxHeight: '100%',
    objectFit: 'contain',
    display: 'block'
  };
}

export function getContentStyle(fixedImageHeight: boolean): CSSProperties {
  return {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    ...(fixedImageHeight ? {minHeight: '180px'} : {})
  };
}

export function getTitleStyle(fixedImageHeight: boolean): CSSProperties {
  const base: CSSProperties = {
    fontSize: '1.3rem',
    color: 'var(--dark-color)',
    fontWeight: 600,
    lineHeight: 1.4,
    ...wordBreakStyle
  };

  if (fixedImageHeight) {
    return {
      ...base,
      marginBottom: '0.75rem',
      marginTop: 0,
      minHeight: '3.64rem',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };
  }

  return {
    ...base,
    marginBottom: '0.5rem',
    minHeight: '4.32rem'
  };
}

export function getSubtitleStyle(fixedImageHeight: boolean): CSSProperties {
  const base: CSSProperties = {
    color: 'var(--text-light)',
    lineHeight: 1.6,
    margin: 0,
    ...wordBreakStyle
  };

  if (fixedImageHeight) {
    return {
      ...base,
      marginBottom: 'auto',
      fontSize: '0.95rem',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    };
  }

  return {
    ...base,
    minHeight: '5.5rem'
  };
}

export const articleTextWrapperStyle: CSSProperties = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column'
};
