# GitHub Pages 显示 README 问题修复指南

## 问题描述

部署到 GitHub Pages 后，打开网址显示的是 README.md 的内容，而不是网站内容。

## 原因分析

这个问题通常由以下几个原因导致：

### 1. ⚠️ GitHub Pages 源配置错误（最常见）

**问题：** GitHub Pages 可能配置为从**分支**读取文件，而不是从 **GitHub Actions** 构建的输出读取。

**检查方法：**
1. 进入 GitHub 仓库
2. 点击 **Settings**（设置）
3. 找到 **Pages**（页面）部分
4. 查看 **Source**（源）设置

**错误配置：**
- ❌ Source: `Deploy from a branch`（从分支部署）
- ❌ Branch: `main` 或 `master`
- ❌ Folder: `/ (root)` 或 `/docs`

**正确配置：**
- ✅ Source: `GitHub Actions`（GitHub Actions）

---

### 2. ⚠️ 缺少 `.nojekyll` 文件

**问题：** GitHub Pages 默认使用 Jekyll 处理文件，可能会：
- 忽略以下划线开头的文件（如 `_next`）
- 将 README.md 渲染为首页
- 导致 Next.js 构建的文件无法正常工作

**解决方案：** 已创建 `public/.nojekyll` 文件（空文件）

---

### 3. ⚠️ 构建失败

**问题：** GitHub Actions 构建可能失败，导致没有生成 `out/` 目录。

**检查方法：**
1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 查看最新的工作流运行
4. 检查是否有错误

---

## 修复步骤

### 步骤 1: 检查 GitHub Pages 设置

1. **进入仓库设置**
   - 打开您的 GitHub 仓库
   - 点击 **Settings**（设置）

2. **检查 Pages 配置**
   - 在左侧菜单找到 **Pages**
   - 查看 **Source**（源）部分

3. **修复配置（如果需要）**
   - 如果 Source 是 `Deploy from a branch`，需要改为 `GitHub Actions`
   - 如果已经是 `GitHub Actions`，检查是否有部署错误

**如何修改：**
- 如果显示 "Your site is live at..." 但源是分支，需要：
  1. 点击 Source 下拉菜单
  2. 选择 **GitHub Actions**
  3. 保存

---

### 步骤 2: 确认 `.nojekyll` 文件存在

**已创建：** `public/.nojekyll` 文件

**验证：**
```bash
# 检查文件是否存在
ls public/.nojekyll
```

**如果文件不存在，手动创建：**
```bash
# Windows PowerShell
New-Item -Path "public\.nojekyll" -ItemType File

# Linux/Mac
touch public/.nojekyll
```

**提交文件：**
```bash
git add public/.nojekyll
git commit -m "Add .nojekyll to disable Jekyll processing"
git push
```

---

### 步骤 3: 检查 GitHub Actions 构建

1. **查看 Actions 日志**
   - 进入仓库的 **Actions** 标签
   - 点击最新的工作流运行
   - 检查是否有错误

2. **常见构建错误：**
   - ❌ 依赖安装失败 → 检查 `package.json`
   - ❌ 构建失败 → 检查构建日志
   - ❌ 环境变量缺失 → 检查 GitHub Secrets

3. **验证构建输出**
   - 在构建步骤中，应该看到：
     ```
     ✓ Compiled successfully
     ✓ Exporting static files
     ```
   - 检查 `Upload artifact` 步骤是否成功

---

### 步骤 4: 重新触发部署

**方法 1: 推送新提交**
```bash
# 添加 .nojekyll 文件（如果还没有）
git add public/.nojekyll
git commit -m "Fix: Add .nojekyll file for GitHub Pages"
git push
```

**方法 2: 手动触发**
1. 进入 **Actions** 标签
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 **Run workflow**
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow**

---

## 验证修复

### 检查清单

部署完成后，验证以下内容：

- [ ] GitHub Pages 设置中 Source 是 **GitHub Actions**
- [ ] `public/.nojekyll` 文件已提交到仓库
- [ ] GitHub Actions 构建成功（绿色 ✓）
- [ ] 访问网站，显示的是网站内容，不是 README
- [ ] 网站功能正常（导航、语言切换等）

### 测试步骤

1. **等待部署完成**
   - 通常需要 1-3 分钟
   - 在 Actions 中查看部署状态

2. **访问网站**
   - 如果使用自定义域名：`https://www.isperm.com`
   - 如果使用 GitHub 域名：`https://YOUR_USERNAME.github.io/REPO_NAME`

3. **检查内容**
   - ✅ 应该看到网站首页（不是 README）
   - ✅ 导航菜单正常
   - ✅ 语言切换器正常
   - ✅ 所有页面可以访问

---

## 常见问题

### Q1: 修改设置后还是显示 README

**可能原因：**
- 缓存问题
- 部署还在进行中
- 构建失败

**解决方法：**
1. 清除浏览器缓存（Ctrl+Shift+R 或 Cmd+Shift+R）
2. 等待 5-10 分钟让 GitHub Pages 更新
3. 检查 Actions 日志确认部署成功

---

### Q2: 构建成功但网站还是显示 README

**可能原因：**
- `.nojekyll` 文件没有正确上传
- GitHub Pages 还在使用旧的部署

**解决方法：**
1. 确认 `public/.nojekyll` 文件在仓库中
2. 在 GitHub 仓库中查看 `public/.nojekyll` 是否存在
3. 如果不存在，重新提交并推送

---

### Q3: 如何确认 GitHub Pages 使用的是 Actions 部署？

**检查方法：**
1. 进入仓库 **Settings** > **Pages**
2. 查看 **Source** 部分
3. 应该显示：
   ```
   Source: GitHub Actions
   ```
   而不是：
   ```
   Source: Deploy from a branch
   Branch: main
   ```

---

## 快速修复命令

如果问题仍然存在，执行以下命令：

```bash
# 1. 确保 .nojekyll 文件存在
touch public/.nojekyll

# 2. 提交并推送
git add public/.nojekyll
git commit -m "Fix: Add .nojekyll to disable Jekyll"
git push

# 3. 等待 GitHub Actions 自动部署（1-3分钟）
```

---

## 总结

### 必须完成的步骤

1. ✅ **检查 GitHub Pages 设置** - Source 必须是 "GitHub Actions"
2. ✅ **添加 `.nojekyll` 文件** - 已创建在 `public/.nojekyll`
3. ✅ **提交并推送** - 让 GitHub Actions 重新部署
4. ✅ **验证部署** - 检查 Actions 日志和网站

### 预期结果

修复后，访问网站应该：
- ✅ 显示网站首页（不是 README）
- ✅ 所有功能正常工作
- ✅ 多语言路由正常（/en, /es 等）

---

**创建时间：** 2024年12月  
**状态：** ✅ 已创建 `.nojekyll` 文件，请检查 GitHub Pages 设置
