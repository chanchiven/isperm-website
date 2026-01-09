'use client';

import {useEffect} from 'react';
import {routing} from '@/i18n/routing';

/**
 * 根路径重定向页面
 * 在开发模式下，中间件会处理重定向
 * 在静态导出时，使用客户端重定向
 */
export default function RootPage() {
  useEffect(() => {
    // 客户端重定向到默认语言
    if (typeof window !== 'undefined') {
      window.location.href = `/${routing.defaultLocale}`;
    }
  }, []);
  
  // 显示加载提示（可选）
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <p>Redirecting...</p>
    </div>
  );
}
