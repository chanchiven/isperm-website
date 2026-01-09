'use client';

import {Link} from '@/i18n/routing';
import {useLocale} from 'next-intl';
import type {CSSProperties} from 'react';

interface FAQArticleCardProps {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  fixedImageHeight?: boolean; // If true, use fixed height (240px), if false, use original format (minHeight: 200px, maxHeight: 400px)
}

/**
 * 客户端文章卡片组件，确保链接正确保留当前语言
 */
export function FAQArticleCard({slug, title, subtitle, image, alt, fixedImageHeight = false}: FAQArticleCardProps) {
  const locale = useLocale();
  
  // Image container style based on fixedImageHeight prop
  const imageContainerStyle: CSSProperties = fixedImageHeight 
    ? {
        width: '100%', 
        height: '240px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--light-color)', 
        padding: '1rem',
        flexShrink: 0,
        overflow: 'hidden'
      }
    : {
        width: '100%', 
        minHeight: '200px', 
        maxHeight: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--white)', 
        padding: '1rem'
      };
  
  const imageStyle: CSSProperties = fixedImageHeight
    ? {
        width: '100%', 
        height: '100%', 
        objectFit: 'contain', 
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%'
      }
    : {
        width: '100%', 
        height: 'auto', 
        maxHeight: '100%', 
        objectFit: 'contain', 
        display: 'block'
      };
  
  const contentStyle: CSSProperties = fixedImageHeight
    ? {
        padding: '1.5rem', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0,
        minHeight: '180px'
      }
    : {
        padding: '1.5rem', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minWidth: 0
      };
  
  const titleStyle: CSSProperties = fixedImageHeight
    ? {
        fontSize: '1.3rem', 
        marginBottom: '0.75rem', 
        marginTop: 0,
        color: 'var(--dark-color)', 
        fontWeight: 600, 
        overflowWrap: 'break-word', 
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        hyphens: 'auto',
        lineHeight: 1.4,
        minHeight: '3.64rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      } as CSSProperties
    : {
        fontSize: '1.3rem', 
        marginBottom: '0.5rem', 
        color: 'var(--dark-color)', 
        fontWeight: 600, 
        overflowWrap: 'break-word', 
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        hyphens: 'auto',
        lineHeight: 1.4,
        minHeight: '4.32rem'
      };
  
  const subtitleStyle: CSSProperties = fixedImageHeight
    ? {
        color: 'var(--text-light)', 
        lineHeight: 1.6, 
        margin: 0, 
        marginBottom: 'auto',
        overflowWrap: 'break-word', 
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        hyphens: 'auto',
        fontSize: '0.95rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      } as CSSProperties
    : {
        color: 'var(--text-light)', 
        lineHeight: 1.6, 
        margin: 0, 
        overflowWrap: 'break-word', 
        wordWrap: 'break-word',
        wordBreak: 'break-word',
        hyphens: 'auto',
        minHeight: '5.5rem'
      };
  
  return (
    <article className="article-card" style={{
      background: 'var(--white)', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow)', 
      border: '1px solid var(--border-color)', 
      transition: 'all 0.3s ease', 
      display: 'flex', 
      flexDirection: 'column', 
      maxWidth: '100%'
    }}>
      <Link 
        href={`/faq/${slug}` as any} 
        locale={locale as any}
        style={{
          textDecoration: 'none', 
          color: 'inherit', 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%'
        }}
      >
        <div className="article-image" style={imageContainerStyle}>
          <img 
            src={image} 
            alt={alt} 
            style={imageStyle} 
            loading="lazy" 
            decoding="async" 
          />
        </div>
        <div className="article-content" style={contentStyle}>
          <div style={{flex: '1', display: 'flex', flexDirection: 'column'}}>
            <h3 style={titleStyle}>
              {title}
            </h3>
            <p style={subtitleStyle}>
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
