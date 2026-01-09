# GitHub Pages 部署指南

本指南将帮助您将 Next.js 网站部署到 GitHub Pages。

## 📋 前置要求

1. **GitHub 账号** - 如果没有，请先注册 [GitHub](https://github.com)
2. **Git 已安装** - 检查是否已安装：在命令行运行 `git --version`
3. **Node.js 已安装** - 检查是否已安装：在命令行运行 `node --version`

## 🚀 部署步骤

### 步骤 1: 在 GitHub 上创建仓库

1. 登录 GitHub
2. 点击右上角的 **+** 号，选择 **New repository**
3. 填写仓库信息：
   - **Repository name**: 输入仓库名称（例如：`isperm-website`）
   - **Description**: 可选，填写项目描述
   - **Visibility**: 选择 **Public**（GitHub Pages 免费版需要公开仓库）
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 **Create repository**

### 步骤 2: 初始化本地 Git 仓库（如果还没有）

如果您的项目还没有 Git 仓库，请在项目根目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit"
```

### 步骤 3: 连接到 GitHub 仓库

```bash
# 添加远程仓库（将 YOUR_USERNAME 和 YOUR_REPO_NAME 替换为您的实际信息）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 将代码推送到 GitHub
git branch -M main
git push -u origin main
```

**示例**：
```bash
git remote add origin https://github.com/yourusername/isperm-website.git
git branch -M main
git push -u origin main
```

### 步骤 4: 配置 GitHub Pages 设置

1. 在 GitHub 仓库页面，点击 **Settings**（设置）
2. 在左侧菜单中找到 **Pages**（页面）
3. 在 **Source**（源）部分：
   - 选择 **GitHub Actions** 作为部署源
4. 点击 **Save**（保存）

### 步骤 5: 配置自定义域名（可选）

如果您有自定义域名（如 `www.isperm.com`）：

1. 在 GitHub 仓库的 **Settings** > **Pages** 中
2. 在 **Custom domain**（自定义域名）字段输入您的域名
3. 点击 **Save**
4. 在您的域名 DNS 设置中添加以下记录：
   - **类型**: CNAME
   - **名称**: www（或您想要的子域名）
   - **值**: `YOUR_USERNAME.github.io`（例如：`yourusername.github.io`）

**注意**：项目根目录已经有 `CNAME` 文件，包含 `www.isperm.com`。如果您使用自定义域名，确保：
- DNS 记录已正确配置
- `CNAME` 文件中的域名正确

### 步骤 6: 触发部署

部署会在以下情况自动触发：
- 推送到 `main` 分支
- 手动触发（在 Actions 标签页）

**查看部署状态**：
1. 在 GitHub 仓库页面，点击 **Actions** 标签
2. 您会看到 "Deploy to GitHub Pages" 工作流
3. 点击进入查看详细日志

### 步骤 7: 访问您的网站

部署完成后，您的网站将在以下地址可用：

- **使用 GitHub Pages 默认域名**：
  - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
  - 如果仓库名是 `username.github.io`，则直接是 `https://YOUR_USERNAME.github.io`

- **使用自定义域名**：
  - `https://www.isperm.com`（根据您的 CNAME 配置）

## ⚙️ 配置说明

### basePath 配置

如果您的仓库名**不是** `username.github.io`，您需要配置 `basePath`：

1. 打开 `next.config.js`
2. 取消注释并修改 `basePath` 行：
   ```javascript
   basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
   ```
   将 `your-repo-name` 替换为您的实际仓库名

**示例**：如果仓库名是 `isperm-website`，则：
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/isperm-website' : '',
```

### 静态部署限制

⚠️ **重要提示**：GitHub Pages 是静态托管，有以下限制：

#### 1. 中间件限制

当前项目使用了中间件来：
- 检测中文用户并返回 404
- 处理语言重定向

在静态部署中：
- ✅ 多语言路由会正常工作（每种语言会生成静态页面）
- ❌ 服务器端语言检测和重定向可能无法完全工作
- ✅ 客户端 JavaScript 会处理基本的语言切换

#### 2. API 路由限制

⚠️ **联系表单无法工作**：项目中的 `/api/send` 路由用于发送联系表单邮件，但在静态部署中无法运行。

**解决方案**：

**方案 A：使用第三方表单服务（推荐）**
- [Formspree](https://formspree.io/) - 免费版支持 50 次提交/月
- [Netlify Forms](https://www.netlify.com/products/forms/) - 免费版支持 100 次提交/月
- [EmailJS](https://www.emailjs.com/) - 免费版支持 200 次/月

**方案 B：使用支持 API 的托管平台**
如果需要完整的 API 功能，建议使用：
- **Vercel**（推荐，Next.js 官方平台，免费）
- **Netlify**（免费，支持表单和函数）
- **Cloudflare Pages**（免费，支持 Workers）

**方案 C：修改联系表单**
将联系表单改为使用第三方服务，例如：

```tsx
// 使用 Formspree 示例
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  {/* 表单字段 */}
</form>
```

## 🔄 更新网站

每次更新网站内容后：

```bash
# 添加更改的文件
git add .

# 提交更改
git commit -m "更新网站内容"

# 推送到 GitHub（会自动触发部署）
git push origin main
```

部署通常需要 1-3 分钟完成。

## 🐛 常见问题

### 1. 部署失败

**检查**：
- GitHub Actions 日志中的错误信息
- `next.config.js` 配置是否正确
- 构建是否成功（运行 `npm run build` 本地测试）

### 2. 页面显示 404

**可能原因**：
- `basePath` 配置不正确
- 路由路径问题
- 检查 GitHub Pages 设置中的源是否正确

### 3. 图片不显示

**检查**：
- 图片路径是否正确
- 图片是否在 `public/` 目录下
- `basePath` 配置是否正确

### 4. 样式不加载

**检查**：
- CSS 文件路径
- `basePath` 配置
- 浏览器控制台错误信息

## 📚 相关资源

- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Next.js 静态导出文档](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

## 🆘 需要帮助？

如果遇到问题：
1. 检查 GitHub Actions 日志
2. 查看浏览器控制台错误
3. 确认所有配置步骤都已完成

---

**祝您部署顺利！** 🎉
