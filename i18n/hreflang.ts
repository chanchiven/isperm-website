import {routing} from './routing';

/**
 * 生成 hreflang alternates 和 canonical 对象
 * 用于在页面的 generateMetadata 函数中使用
 *
 * @param currentPath - 当前页面的路径（不包含语言前缀），例如 '/about', '/products/nexus-dx1'
 * @param locale - 当前页面语言，用于生成 canonical URL（自引用 canonical 防止权重分散）
 * @returns alternates 对象，包含 canonical 和所有语言的 hreflang 链接
 */
export function generateHreflangAlternates(currentPath: string = '/', locale?: string) {
  const baseUrl = 'https://www.isperm.com';
  const path = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');

  const alternates: {canonical?: string; languages: Record<string, string>} = {
    languages: {}
  };

  // 为所有支持的语言生成 hreflang 链接
  routing.locales.forEach((loc) => {
    alternates.languages[loc] = `${baseUrl}/${loc}${cleanPath}`;
  });

  // 添加 x-default：当用户语言不匹配时显示的默认页面（指向默认语言）
  alternates.languages['x-default'] = `${baseUrl}/${routing.defaultLocale}${cleanPath}`;

  // 添加 canonical 标签：指向当前页面的 URL，防止多语言版本权重分散
  if (locale && routing.locales.includes(locale as (typeof routing.locales)[number])) {
    alternates.canonical = `${baseUrl}/${locale}${cleanPath}`;
  }

  return alternates;
}
