import {ReactNode, CSSProperties} from 'react';

interface HoverableDivProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function HoverableDiv({children, className, style}: HoverableDivProps) {
  return (
    <div
      className={className ? `hover-lift-card ${className}` : 'hover-lift-card'}
      style={style}
    >
      {children}
    </div>
  );
}
