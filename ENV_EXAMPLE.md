# 环境变量配置示例

## 📝 本地开发配置

创建 `.env.local` 文件（项目根目录），添加以下内容：

```env
# Formspree 表单 ID
# 您的表单 URL: https://formspree.io/f/meeejqka
# 表单 ID: meeejqka
NEXT_PUBLIC_FORMSPREE_ID=meeejqka

# Web3Forms（备选方案，如果不想使用 Formspree）
# NEXT_PUBLIC_WEB3FORMS_KEY=your_access_key_here
```

## 🔐 GitHub Secrets 配置

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

- **Name**: `NEXT_PUBLIC_FORMSPREE_ID`
- **Value**: `meeejqka`

## ⚠️ 重要提示

- `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
- 不要将真实的密钥提交到代码仓库
- GitHub Secrets 用于生产环境部署
