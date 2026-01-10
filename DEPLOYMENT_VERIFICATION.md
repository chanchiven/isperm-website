# Next.js 应用部署验证指南

## ✅ 已完成的配置

### 1. 部署工作流优化
- ✅ 添加了 `.nojekyll` 文件验证
- ✅ 添加了根路径 `index.html` 验证
- ✅ 添加了构建输出结构验证

### 2. 根路径重定向
- ✅ `app/page.tsx` 已配置客户端重定向到 `/en`
- ✅ `app/layout.tsx` 已添加默认 meta description

### 3. Jekyll 禁用
- ✅ `public/.nojekyll` 文件已存在
- ✅ 部署工作流确保 `out/.nojekyll` 存在

## 🔍 验证步骤

### 1. 检查 GitHub Pages 设置

1. 进入仓库的 **Settings** → **Pages**
2. 确认 **Source** 设置为：
   - **GitHub Actions**（不是 "Deploy from a branch"）
3. 确认自定义域名配置正确（如果使用）

### 2. 检查部署工作流

1. 进入 **Actions** 标签页
2. 查看最新的部署工作流运行
3. 确认所有步骤都成功：
   - ✅ Build 成功
   - ✅ `.nojekyll` 文件创建成功
   - ✅ `index.html` 验证通过
   - ✅ 部署成功

### 3. 验证构建输出

在部署工作流的日志中，应该看到：

```
✓ Root index.html exists
✓ .nojekyll found in out/
✓ index.html found in out/
```

### 4. 测试网站

部署完成后，测试以下 URL：

1. **根路径**：`https://www.isperm.com/`
   - 应该自动重定向到 `/en`
   - 不应该显示 Jekyll 渲染的 README

2. **默认语言**：`https://www.isperm.com/en`
   - 应该显示 Next.js 应用的首页
   - 应该包含正确的 meta description

3. **其他语言**：`https://www.isperm.com/es`, `/ar`, `/de` 等
   - 应该正常显示对应语言的页面

4. **验证 `.nojekyll`**：`https://www.isperm.com/.nojekyll`
   - 应该能访问到文件（即使是空文件）

## 🐛 故障排查

### 问题 1: 根路径仍显示 Jekyll 渲染的 README

**可能原因：**
- GitHub Pages 仍在使用 Jekyll 渲染
- `.nojekyll` 文件未正确部署

**解决方案：**
1. 确认 GitHub Pages 使用 **GitHub Actions** 作为源
2. 检查部署日志，确认 `.nojekyll` 文件已创建
3. 手动访问 `https://www.isperm.com/.nojekyll` 验证文件存在
4. 如果文件不存在，重新触发部署工作流

### 问题 2: 根路径显示 404

**可能原因：**
- `app/page.tsx` 未正确生成 `index.html`

**解决方案：**
1. 检查构建日志，确认 `out/index.html` 存在
2. 查看 `out/index.html` 的内容，确认包含重定向代码
3. 确认 `next.config.js` 中 `output: 'export'` 已启用

### 问题 3: 重定向不工作

**可能原因：**
- JavaScript 被禁用
- 客户端重定向失败

**解决方案：**
1. 检查 `app/page.tsx` 中的重定向代码
2. 确认页面包含手动链接作为后备
3. 测试 JavaScript 禁用情况下的行为

## 📋 部署检查清单

部署前：
- [ ] 代码已推送到 `main` 分支
- [ ] `app/page.tsx` 存在且正确配置
- [ ] `public/.nojekyll` 文件存在
- [ ] `next.config.js` 中 `output: 'export'` 已启用
- [ ] GitHub Pages 设置使用 **GitHub Actions**

部署后：
- [ ] 部署工作流成功完成
- [ ] 根路径重定向到 `/en`
- [ ] 所有语言路径正常工作
- [ ] Meta description 正确显示
- [ ] `.nojekyll` 文件可访问
- [ ] 没有 Jekyll 渲染的 README 显示

## 🎯 预期行为

### 正确的部署结果

1. **访问 `https://www.isperm.com/`**：
   - 自动重定向到 `https://www.isperm.com/en`
   - 显示 Next.js 应用的首页
   - 包含正确的 meta description

2. **HTML 源代码**：
   - 包含 Next.js 的 HTML 结构
   - 包含 React 组件
   - **不包含** Jekyll SEO 标签
   - **不包含** README.md 的内容

3. **Meta 标签**：
   - 包含 `<meta name="description">` 标签
   - 包含正确的 title
   - 不包含 Jekyll 生成的 meta 标签

## 📝 下一步

如果部署后仍有问题：

1. 检查 GitHub Actions 日志
2. 验证构建输出结构
3. 确认 GitHub Pages 设置
4. 测试不同浏览器的行为
5. 检查浏览器控制台是否有错误
