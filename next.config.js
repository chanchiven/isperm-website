const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 输出静态文件（用于 GitHub Pages 部署）
  output: 'export',
  
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
