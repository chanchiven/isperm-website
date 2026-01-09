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

// 检测是否为中文用户（简体或繁体）或中国/台湾IP（不包括香港）
function isChineseUser(request: NextRequest): boolean {
  // 1. 检测浏览器语言
  // 只匹配简体中文(zh-CN)和繁体中文-台湾(zh-TW)
  // 注意：排除香港(zh-HK)，允许香港用户正常访问
  const acceptLanguage = request.headers.get('accept-language') || '';
  // 只匹配 zh-CN 或 zh-TW，明确排除 zh-HK 和其他变体
  const isChineseLang = /zh[-_]?(CN|TW)/i.test(acceptLanguage);
  
  // 2. 检测IP地址地理位置
  // 只检测中国(CN)和台湾(TW)，不包括香港(HK)
  // Vercel 自动提供 geo 信息，其他平台（如自托管）可能需要配置
  // 如果 geo 不可用，只依赖语言检测
  const country = request.geo?.country || '';
  const isChineseIP = country === 'CN' || country === 'TW';
  
  // 只要满足语言或IP任一条件，就返回简单404（不包括香港）
  return isChineseLang || isChineseIP;
}

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  
  // 检测中文用户（简体或繁体）或中国/台湾IP（不包括香港），直接返回简单404页面
  if (isChineseUser(request)) {
    // 返回最简单的404页面
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>404</title>
</head>
<body>
  <h1>404</h1>
  <p>Not Found</p>
</body>
</html>`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
  
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
  // - 重定向到匹配的语言路径
  // - 设置语言 cookie
  return intlMiddleware(request);
}

export const config = {
  // 匹配所有路径，但排除以下后缀：
  // _next (内部文件), api (接口), 所有带点的文件 (图片, favicon, robots.txt 等)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
