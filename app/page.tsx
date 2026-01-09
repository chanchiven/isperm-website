import {redirect} from 'next/navigation';
import {routing} from '@/i18n/routing';

/**
 * 根路径重定向页面
 * 在开发模式下，中间件会处理重定向
 * 在静态导出时，这个页面会生成一个重定向到默认语言的页面
 */
export default function RootPage() {
  // 重定向到默认语言
  redirect(`/${routing.defaultLocale}`);
}
