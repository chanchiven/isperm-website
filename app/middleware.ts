import createMiddleware from 'next-intl/middleware';
import {routing} from '../i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

// 创建 next-intl 中间件
// next-intl 默认启用自动语言检测，会按以下顺序检测：
// 1. URL 中的语言前缀 (如 /en/about)
// 2. Cookie (NEXT_LOCALE) - 如果用户之前选择过语言
// 3. Accept-Language header - 浏览器语言设置
// 4. defaultLocale - 默认语言 (en)
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // 处理重复语言代码的情况，如 /es/es -> /es
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length >= 2) {
    const firstSegment = pathSegments[0];
    const secondSegment = pathSegments[1];
    
    if (routing.locales.includes(firstSegment as any) && 
        routing.locales.includes(secondSegment as any) && 
        firstSegment === secondSegment) {
      const remainingPath = pathSegments.slice(1).join('/');
      const correctPath = remainingPath ? `/${firstSegment}/${remainingPath}` : `/${firstSegment}`;
      const redirectUrl = new URL(correctPath, request.url);
      redirectUrl.search = request.nextUrl.search;
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // 调用 next-intl 中间件，它会自动处理：
  // - 检测浏览器语言 (Accept-Language header)
  // - 重定向到匹配的语言路径（如 / -> /en 或 /es 等）
  // - 设置语言 cookie
  // - 处理根路径重定向
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，但排除以下后缀：
  // _next (内部文件), api (接口), 所有带点的文件 (图片, favicon, robots.txt 等)
  // 显式包含根路径 / 以确保中间件正确处理根路径重定向
  matcher: [
    '/',
    '/((?!api|_next|.*\\..*).*)'
  ]
};
