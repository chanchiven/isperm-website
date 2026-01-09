# FAQ 文章页面检查报告

## 检查文件
`app/[locale]/faq/[slug]/page.tsx`

---

## 1. 内容读取逻辑检查

### ✅ 部分依赖 JSON 文件

代码从两个不同的路径读取数据：

1. **文章标题和副标题**（第 28-31 行，第 63-65 行）：
   ```typescript
   const article = articleKey ? {
     title: t(`articles.${articleKey}.title`),
     subtitle: t(`articles.${articleKey}.subtitle`)
   } : null;
   ```
   - ✅ 从 `messages/[locale]/faq.json` 的 `articles.${articleKey}` 路径读取

2. **文章内容**（第 154-193 行）：
   ```typescript
   const articleKey = `FaqArticles.${slug}`;
   const intro = t(`${articleKey}.intro`, {default: null});
   const chapters = t.raw(`${articleKey}.chapters`);
   ```
   - ✅ 从 `messages/[locale]/faq.json` 的 `FaqArticles.${slug}` 路径读取

### ⚠️ 问题发现

**键路径不一致**：
- 标题/副标题使用：`articles.${articleKey}`（通过 slug 映射表转换）
- 文章内容使用：`FaqArticles.${slug}`（直接使用 slug）

这种不一致可能导致：
- 如果 JSON 结构不匹配，会导致内容读取失败
- 维护困难，需要同时维护两个不同的键路径

---

## 2. SEO 检查（generateMetadata）

### ⚠️ 部分通过翻译函数读取

**当前实现**（第 6-39 行）：
```typescript
export async function generateMetadata({ params }: { params: Promise<{locale: string; slug: string}> }): Promise<Metadata> {
  const {locale, slug} = await params;
  const t = await getTranslations({locale, namespace: 'faq'});

  const articleSlugMap: Record<string, string> = { /* ... */ };
  const articleKey = articleSlugMap[slug];
  const article = articleKey ? {
    title: t(`articles.${articleKey}.title`),
    subtitle: t(`articles.${articleKey}.subtitle`)
  } : null;
  const title = article ? `${article.title} | ${t('meta.title')}` : t('meta.title');
  const description = article ? article.subtitle : t('meta.description');

  return { title, description };
}
```

### ✅ 优点
- 使用翻译函数读取标题和描述
- 如果文章不存在，回退到默认的 meta.title 和 meta.description

### ❌ 问题
1. **未触发 notFound()**：如果 slug 不在映射表中（`articleKey` 为 `undefined`），应该返回 404，但当前代码只是回退到默认元数据
2. **可能返回错误的 SEO 信息**：对于无效的 slug，会显示 FAQ 页面的默认标题，而不是 404 页面

---

## 3. 错误处理检查

### ❌ 未正确触发 notFound()

**问题 1：generateMetadata 中缺少 notFound() 调用**

**当前代码**（第 27-33 行）：
```typescript
const articleKey = articleSlugMap[slug];
const article = articleKey ? {
  title: t(`articles.${articleKey}.title`),
  subtitle: t(`articles.${articleKey}.subtitle`)
} : null;
const title = article ? `${article.title} | ${t('meta.title')}` : t('meta.title');
const description = article ? article.subtitle : t('meta.description');
```

**问题**：如果 `slug` 不在 `articleSlugMap` 中，`articleKey` 为 `undefined`，`article` 为 `null`，但代码不会触发 `notFound()`，而是继续返回默认元数据。

**问题 2：页面组件中缺少 notFound() 调用**

**当前代码**（第 62-69 行）：
```typescript
const articleKey = articleSlugMap[slug];
const article = articleKey ? {
  title: t(`articles.${articleKey}.title`),
  subtitle: t(`articles.${articleKey}.subtitle`)
} : {
  title: 'Article Not Found',
  subtitle: 'The requested article could not be found.'
};
```

**问题**：
- 如果 `articleKey` 不存在，显示硬编码的英文错误信息（未使用翻译函数）
- 没有触发 `notFound()`，页面会继续渲染，但显示错误内容

**问题 3：文章内容缺失时的处理**

**当前代码**（第 157-168 行）：
```typescript
if (!intro) {
  // Article not found in JSON, show placeholder
  return (
    <div>
      <p>This article is currently being prepared. Full content will be available soon.</p>
      <p>Please check back later or <Link href="/contact">contact us</Link> for more information.</p>
    </div>
  );
}
```

**问题**：
- 如果文章内容不存在，显示占位符文本（硬编码英文）
- 应该触发 `notFound()` 而不是显示占位符

---

## 总结

### 发现的问题

1. ❌ **错误处理不完善**：当 slug 不存在时，没有触发 `notFound()`
2. ❌ **硬编码错误信息**：错误信息使用硬编码英文，未使用翻译函数
3. ⚠️ **键路径不一致**：标题使用 `articles.${articleKey}`，内容使用 `FaqArticles.${slug}`
4. ⚠️ **SEO 问题**：无效 slug 返回默认元数据而不是 404

### 建议修复

1. 在 `generateMetadata` 和页面组件中添加 `notFound()` 调用
2. 移除硬编码错误信息，使用翻译函数
3. 统一键路径结构（建议统一使用一种路径）
4. 添加翻译键用于错误信息

---

## 需要修复的代码位置

1. **第 6-39 行**：`generateMetadata` 函数
2. **第 41-69 行**：页面组件开始部分
3. **第 154-168 行**：文章内容读取逻辑

