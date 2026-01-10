# GitHub Pages 显示 Jekyll 页面问题修复指南

## 🔴 问题描述

访问 `https://www.isperm.com/` 时，看到的是 GitHub Pages 默认的 Jekyll 页面，而不是 Next.js 构建的网站。

**错误现象：**
- 显示 Jekyll 生成的 README.md 页面
- 看到 `<title>iSperm Medical Website | isperm-website</title>`
- HTML 中包含 Jekyll SEO 标签
- 不是 Next.js 构建的内容

## 🔍 原因分析

这个问题通常由以下原因之一导致：

1. **GitHub Pages Source 设置错误**：设置为分支部署而不是 GitHub Actions
2. **`.nojekyll` 文件缺失**：构建输出中没有 `.nojekyll` 文件
3. **GitHub Actions 部署未执行**：工作流没有成功运行
4. **CNAME 文件位置错误**：CNAME 文件应该在构建输出中

## ✅ 解决方案

### 步骤 1: 检查 GitHub Pages 设置

1. 访问 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. **Source** 必须设置为 **"GitHub Actions"**，**不是**某个分支（如 main 或 gh-pages）
   - ✅ 正确：Source = **GitHub Actions**
   - ❌ 错误：Source = **Deploy from a branch** / main / gh-pages

### 步骤 2: 验证 GitHub Actions 工作流

1. 点击 **Actions** 标签
2. 查看 **"Deploy to GitHub Pages"** 工作流
3. 确认最近一次运行是否成功（绿色勾号）
4. 如果失败，点击查看错误日志

### 步骤 3: 确保代码已正确提交

确保以下文件已提交到 GitHub：

```bash
# 关键文件
.github/workflows/deploy.yml   # GitHub Actions 工作流
public/.nojekyll                # 禁用 Jekyll 文件
CNAME                           # 自定义域名配置
next.config.js                  # Next.js 配置
package.json                    # 依赖配置
```

### 步骤 4: 手动触发部署（如果需要）

1. 访问 **Actions** 标签
2. 选择 **"Deploy to GitHub Pages"** 工作流
3. 点击 **"Run workflow"** 按钮
4. 选择 **main** 分支
5. 点击 **"Run workflow"**

### 步骤 5: 验证部署

部署完成后，检查：

1. **GitHub Pages 部署状态**：
   - Settings → Pages → 应该显示 "Your site is published at..."
   - 应该显示最近一次部署的时间

2. **访问网站**：
   - `https://www.isperm.com/` 应该显示 Next.js 网站
   - 检查浏览器开发者工具，确认 HTML 是 Next.js 生成的（不是 Jekyll）

3. **检查 `.nojekyll` 文件**：
   - 访问 `https://www.isperm.com/.nojekyll`
   - 应该能访问到（即使显示为空）

## 🔧 已修复的内容

### 1. 更新了 GitHub Actions 工作流

在 `.github/workflows/deploy.yml` 中添加了确保 `.nojekyll` 文件存在的步骤：

```yaml
- name: Ensure .nojekyll exists
  run: |
    touch out/.nojekyll
    echo ".nojekyll file created/verified"
    ls -la out/.nojekyll
```

### 2. 确保 CNAME 文件被复制

Next.js 会自动将 `public/` 目录的内容复制到构建输出的根目录，包括：
- `public/.nojekyll` → `out/.nojekyll`
- `public/CNAME` → `out/CNAME`
- `public/sitemap.xml` → `out/sitemap.xml`
- `public/atom.xml` → `out/atom.xml`

## 🚨 常见问题

### Q1: 如何确认 GitHub Pages 使用的是 GitHub Actions？

**A:** 在 Settings → Pages 中：
- 如果看到 "Your site is being built from..." 且显示为 GitHub Actions 工作流名称，则是正确的
- 如果看到 "Deploy from a branch"，则需要切换到 GitHub Actions

### Q2: 如果 Source 设置为分支会怎样？

**A:** GitHub Pages 会：
1. 使用 Jekyll 构建该分支的内容
2. 忽略 GitHub Actions 构建的 `out/` 目录
3. 显示 README.md 或其他 Jekyll 页面

### Q3: 如何强制 GitHub Pages 使用 GitHub Actions？

**A:** 
1. Settings → Pages
2. 在 Source 下拉菜单中选择 **"GitHub Actions"**
3. 如果看不到这个选项，需要：
   - 确保 `.github/workflows/deploy.yml` 文件存在
   - 确保工作流使用 `actions/deploy-pages@v4` action
   - 可能需要等待几分钟让 GitHub 识别工作流

### Q4: 为什么 `.nojekyll` 文件很重要？

**A:** `.nojekyll` 文件告诉 GitHub Pages：
- **不要**使用 Jekyll 构建网站
- 直接提供静态文件（Next.js 构建的 HTML/CSS/JS）

如果没有这个文件，GitHub Pages 会尝试用 Jekyll 构建，导致错误。

## 📋 检查清单

在修复后，确认以下所有项目：

- [ ] GitHub Pages Source 设置为 **"GitHub Actions"**
- [ ] GitHub Actions 工作流成功运行（绿色勾号）
- [ ] `.github/workflows/deploy.yml` 文件存在且正确
- [ ] `public/.nojekyll` 文件存在
- [ ] `CNAME` 文件存在且内容为 `www.isperm.com`
- [ ] 访问 `https://www.isperm.com/` 显示 Next.js 网站（不是 Jekyll）
- [ ] 访问 `https://www.isperm.com/.nojekyll` 能访问到文件
- [ ] 浏览器开发者工具显示 Next.js 生成的 HTML（不是 Jekyll）

## 🔄 如果问题仍然存在

1. **清除浏览器缓存**：Ctrl+F5 或 Cmd+Shift+R
2. **检查 DNS 设置**：确保 `www.isperm.com` 正确指向 GitHub Pages
3. **查看 GitHub Actions 日志**：确认构建和部署是否成功
4. **等待几分钟**：GitHub Pages 更新可能需要 1-5 分钟

## 📞 需要帮助？

如果按照以上步骤操作后问题仍然存在，请检查：
- GitHub Actions 工作流的完整日志
- GitHub Pages 的部署历史
- 浏览器控制台的错误信息
