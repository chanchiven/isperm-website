const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出静态文件（用于 GitHub Pages / Cloudflare Pages 部署）
  // 只在生产构建时启用静态导出，开发模式需要中间件支持
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  // 生成 en/index.html 而非 en.html，使 /en/ 在静态托管（Cloudflare/GitHub Pages）上正确解析
  trailingSlash: true,
  
  // GitHub Pages 基础路径配置
  // 如果仓库名不是 'username.github.io'，需要设置 basePath
  // 例如：如果仓库名是 'my-website'，则 basePath 应该是 '/my-website'
  // 如果使用自定义域名（如 www.isperm.com），则不需要 basePath
  // basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
  
  // 图片优化配置
  // 静态导出时必须禁用图片优化
  images: {
    unoptimized: true,
  },
  
  // 其他配置...
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
