# Next.js 迁移快速开始

## 📋 前提条件

- Node.js 18+ 
- npm/yarn/pnpm

## 🚀 快速开始

### 1. 创建新的 Next.js 项目

```bash
npx create-next-app@latest isperm-medical-nextjs
cd isperm-medical-nextjs
```

### 2. 安装 next-intl

```bash
npm install next-intl
```

### 3. 复制翻译文件

```bash
# 从当前项目复制翻译文件
cp -r translations messages

# 或重命名
mv translations messages
```

### 4. 按照 `NEXTJS_NEXT_INTL_INTEGRATION.md` 配置

参考主目录下的 `NEXTJS_NEXT_INTL_INTEGRATION.md` 文件进行配置。

## 📁 项目结构

```
isperm-medical-nextjs/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── products/
│   │   └── contact/
│   ├── layout.tsx
│   └── middleware.ts
├── messages/
│   ├── en/
│   ├── es/
│   └── ar/
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── types.ts
└── hooks/
    └── useTypedTranslation.ts
```

## ✅ 迁移检查清单

- [ ] 安装 next-intl
- [ ] 配置 next.config.js
- [ ] 创建 i18n 配置
- [ ] 设置 middleware
- [ ] 配置根布局
- [ ] 复制翻译文件
- [ ] 创建类型安全的 Hook
- [ ] 迁移页面组件
- [ ] 测试所有语言
- [ ] 测试 SEO
- [ ] 部署

