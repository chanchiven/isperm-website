import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'es', 'ar', 'de', 'it', 'pt', 'ru', 'tr', 'fr', 'pl', 'nl', 'ko', 'ja', 'vi', 'id', 'uk', 'bg', 'ro'],
  // 默认语言
  defaultLocale: 'en',
  // 是否在默认语言路径中也显示前缀 (如 /en/about)，建议 true 对 SEO 更好
  localePrefix: 'always',
  // 启用自动语言检测（默认已启用）
  // 检测顺序：
  // 1. URL 中的语言前缀 (如 /en/about)
  // 2. Cookie (NEXT_LOCALE) - 如果用户之前选择过语言
  // 3. Accept-Language header - 浏览器语言设置
  // 4. defaultLocale - 默认语言 (en)
  localeDetection: true,
  // 路径名配置
  pathnames: {
    '/': '/',
    '/about': '/about',
    '/products': '/products',
    '/products/nexus-dx1': '/products/nexus-dx1',
    '/products/msqa-100': '/products/msqa-100',
    '/products/sqa-6100vet': '/products/sqa-6100vet',
    '/contact': '/contact',
    '/faq': '/faq',
    '/search': '/search'
  }
});

// 导出经过封装的导航组件，Cursor 以后写跳转必须用这里的 Link
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
