'use client';

import {useEffect} from 'react';
import {routing} from '@/i18n/routing';

/**
 * 根路径重定向页面
 * 在开发模式下，中间件会处理重定向
 * 在静态导出时，使用客户端重定向
 */
export default function RootPage() {
  const defaultLocale = routing.defaultLocale;
  const redirectUrl = `/${defaultLocale}`;
  
  useEffect(() => {
    // 客户端重定向到默认语言（立即执行，不等待渲染）
    if (typeof window !== 'undefined') {
      window.location.replace(redirectUrl);
    }
  }, [redirectUrl]);
  
  // 返回包含链接的页面，确保即使 JavaScript 被禁用也能手动点击
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <p style={{ marginBottom: '1rem' }}>Redirecting...</p>
      <p>
        If you are not redirected automatically, please click{' '}
        <a href={redirectUrl} style={{ color: '#00776E', textDecoration: 'underline' }}>
          here
        </a>
        .
      </p>
    </div>
  );
}
