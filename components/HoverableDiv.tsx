'use client';

import { ReactNode, CSSProperties } from 'react';

interface HoverableDivProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onHoverEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHoverLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  hoverStyle?: {
    transform?: string;
    boxShadow?: string;
    background?: string;
    opacity?: string | number;
  };
  defaultStyle?: {
    boxShadow?: string;
    transform?: string;
    background?: string;
    opacity?: string | number;
  };
}

export function HoverableDiv({ 
  children, 
  className, 
  style,
  onHoverEnter,
  onHoverLeave,
  hoverStyle = { transform: 'translateY(-5px)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' },
  defaultStyle = { transform: 'translateY(0)', boxShadow: 'var(--shadow)' }
}: HoverableDivProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onHoverEnter) {
      onHoverEnter(e);
    } else {
      const target = e.currentTarget;
      if (hoverStyle.transform) target.style.transform = hoverStyle.transform;
      if (hoverStyle.boxShadow) target.style.boxShadow = hoverStyle.boxShadow;
      if (hoverStyle.background) target.style.background = hoverStyle.background;
      if (hoverStyle.opacity !== undefined) target.style.opacity = String(hoverStyle.opacity);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onHoverLeave) {
      onHoverLeave(e);
    } else {
      const target = e.currentTarget;
      if (defaultStyle.transform) target.style.transform = defaultStyle.transform;
      if (defaultStyle.boxShadow) target.style.boxShadow = defaultStyle.boxShadow;
      if (defaultStyle.background) target.style.background = defaultStyle.background || '';
      if (defaultStyle.opacity !== undefined) target.style.opacity = String(defaultStyle.opacity);
    }
  };

  return (
    <div
      className={className}
      style={{
        ...style,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, opacity 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

