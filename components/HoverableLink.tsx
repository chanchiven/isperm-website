import {ReactNode, CSSProperties} from 'react';

interface HoverableLinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  style?: CSSProperties;
  variant?: 'teal-btn' | 'email-link';
}

export function HoverableLink({
  children,
  href,
  className,
  style,
  variant = 'teal-btn'
}: HoverableLinkProps) {
  const variantClass = variant === 'email-link' ? 'hover-email-link' : 'hover-teal-btn';

  return (
    <a
      href={href}
      className={className ? `${variantClass} ${className}` : variantClass}
      style={style}
    >
      {children}
    </a>
  );
}
