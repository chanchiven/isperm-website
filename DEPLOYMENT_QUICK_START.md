# 🚀 GitHub Pages 快速部署指南

## 一键部署步骤

### 1️⃣ 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 **+** → **New repository**
3. 填写仓库名（例如：`isperm-website`）
4. 选择 **Public**
5. **不要**勾选 README
6. 点击 **Create repository**

### 2️⃣ 上传代码到 GitHub

在项目根目录（`d:\RESTART02`）打开 PowerShell 或命令提示符，执行：

```powershell
# 如果还没有初始化 Git
git init
git add .
git commit -m "Initial commit"

# 连接到 GitHub（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**示例**：
```powershell
git remote add origin https://github.com/yourusername/isperm-website.git
git branch -M main
git push -u origin main
```

### 3️⃣ 启用 GitHub Pages

1. 在 GitHub 仓库页面，点击 **Settings**
2. 左侧菜单找到 **Pages**
3. 在 **Source** 选择 **GitHub Actions**
4. 点击 **Save**

### 4️⃣ 等待自动部署

1. 点击 **Actions** 标签
2. 查看 "Deploy to GitHub Pages" 工作流
3. 等待 1-3 分钟完成部署

### 5️⃣ 访问网站

部署完成后，访问：
- `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- 或您的自定义域名（如果已配置）

## ⚠️ 重要配置

### 如果仓库名不是 `username.github.io`

需要修改 `next.config.js` 中的 `basePath`：

```javascript
basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
```

## 📝 更新网站

```powershell
git add .
git commit -m "更新内容"
git push origin main
```

## 📖 详细文档

查看 `GITHUB_PAGES_DEPLOYMENT.md` 获取完整指南。
