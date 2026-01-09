'use client';

import { ReactNode, CSSProperties } from 'react';

interface HoverableLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  style?: CSSProperties;
  hoverStyle?: {
    background?: string;
    transform?: string;
    opacity?: string | number;
  };
  defaultStyle?: {
    background?: string;
    transform?: string;
    opacity?: string | number;
  };
}

export function HoverableLink({ 
  children, 
  href,
  className, 
  style,
  hoverStyle = { background: '#008080', transform: 'translateY(-2px)' },
  defaultStyle = { background: '#00776E', transform: 'translateY(0)' }
}: HoverableLinkProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    if (hoverStyle.background) target.style.background = hoverStyle.background;
    if (hoverStyle.transform) target.style.transform = hoverStyle.transform;
    if (hoverStyle.opacity !== undefined) target.style.opacity = String(hoverStyle.opacity);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    if (defaultStyle.background) target.style.background = defaultStyle.background;
    if (defaultStyle.transform) target.style.transform = defaultStyle.transform || '';
    if (defaultStyle.opacity !== undefined) target.style.opacity = String(defaultStyle.opacity);
  };

  return (
    <a
      href={href}
      className={className}
      style={{
        ...style,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}

