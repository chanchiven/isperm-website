import {routing} from './routing';

/**
 * 生成 hreflang alternates 对象
 * 用于在页面的 generateMetadata 函数中使用
 * 
 * @param currentPath - 当前页面的路径（不包含语言前缀），例如 '/about', '/products/nexus-dx1'
 * @returns alternates 对象，包含所有语言的 hreflang 链接
 */
export function generateHreflangAlternates(currentPath: string = '/') {
  const baseUrl = 'https://www.isperm.com';
  const alternates: {languages: Record<string, string>} = {
    languages: {}
  };
  
  // 为所有支持的语言生成 hreflang 链接
  routing.locales.forEach((locale) => {
    // 确保路径以 / 开头
    const path = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
    // 移除末尾的 /（除了根路径）
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
    alternates.languages[locale] = `${baseUrl}/${locale}${cleanPath}`;
  });
  
  return alternates;
}
