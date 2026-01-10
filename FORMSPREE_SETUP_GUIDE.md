# 📧 Formspree 表单配置完整指南

## ✅ 已完成步骤

### 1. 本地环境变量配置 ✅
已创建 `.env.local` 文件，包含以下配置：
```
NEXT_PUBLIC_FORMSPREE_ID=meeejqka
```

**重要提示：**
- `.env.local` 文件已在 `.gitignore` 中，不会被提交到 Git
- 此文件仅用于本地开发环境

---

## 🔧 需要您完成的步骤

### 步骤 2：配置 GitHub Secrets（用于生产部署）

为了让表单在 GitHub Pages 上正常工作，您需要在 GitHub 仓库中配置 Secrets：

1. **打开 GitHub 仓库**
   - 访问您的仓库：`https://github.com/您的用户名/isperm-website`

2. **进入 Settings**
   - 点击仓库顶部的 **Settings** 标签

3. **打开 Secrets and variables**
   - 在左侧菜单中找到 **Secrets and variables**
   - 点击 **Actions**

4. **添加新的 Secret**
   - 点击 **New repository secret** 按钮
   - **Name**: 输入 `NEXT_PUBLIC_FORMSPREE_ID`
   - **Value**: 输入 `meeejqka`
   - 点击 **Add secret**

5. **验证配置**
   - 您应该能看到 `NEXT_PUBLIC_FORMSPREE_ID` 出现在 Secrets 列表中

---

### 步骤 3：测试本地开发环境

1. **重启开发服务器**
   ```bash
   # 如果服务器正在运行，先停止它（Ctrl+C）
   # 然后重新启动
   npm run dev
   ```

2. **测试表单**
   - 访问 `http://localhost:3000/contact`（或您的本地地址）
   - 填写表单并提交
   - 检查是否显示成功消息

3. **验证 Formspree 接收**
   - 登录您的 Formspree 账户：https://formspree.io
   - 检查表单提交记录
   - 检查您的邮箱（market@isperm.com）是否收到邮件

---

### 步骤 4：部署到生产环境

1. **提交代码**
   ```bash
   git add .
   git commit -m "配置 Formspree 表单集成"
   git push origin main
   ```

2. **等待 GitHub Actions 部署**
   - 访问 `https://github.com/您的用户名/isperm-website/actions`
   - 等待部署工作流完成

3. **测试生产环境**
   - 访问您的网站：`https://您的用户名.github.io/isperm-website/contact`
   - 填写并提交表单
   - 验证是否正常工作

---

## 📋 表单字段映射

您的表单字段已正确映射到 Formspree：

| 表单字段 | Formspree 字段 | 说明 |
|---------|---------------|------|
| 姓名 | `name` | 必填 |
| 公司 | `company` | 可选 |
| 邮箱 | `email` | 必填，同时作为 `_replyto` |
| 产品兴趣 | `productInterest` | 可选（人类产品/动物产品） |
| 消息 | `message` | 可选 |

---

## 🔍 故障排查

### 问题 1：本地开发时表单不工作
**解决方案：**
- 确保 `.env.local` 文件存在于项目根目录
- 确保文件内容为：`NEXT_PUBLIC_FORMSPREE_ID=meeejqka`
- 重启开发服务器（环境变量只在启动时加载）

### 问题 2：生产环境表单不工作
**解决方案：**
- 检查 GitHub Secrets 是否已正确配置
- 检查 GitHub Actions 部署日志，确认环境变量已传递
- 在浏览器控制台检查是否有错误信息

### 问题 3：收到 422 错误
**可能原因：**
- Formspree 表单 ID 不正确
- 表单字段名称不匹配
- Formspree 账户限制（免费版每月 50 次提交）

**解决方案：**
- 验证表单 ID：`meeejqka`
- 检查 Formspree 仪表板中的表单设置
- 确认表单已激活

### 问题 4：没有收到邮件
**解决方案：**
- 检查 Formspree 仪表板中的提交记录
- 确认接收邮箱地址正确（market@isperm.com）
- 检查垃圾邮件文件夹
- 验证 Formspree 账户的邮箱设置

---

## 📞 技术支持

如果遇到问题，可以：
1. 查看 Formspree 文档：https://help.formspree.io
2. 检查浏览器控制台的错误信息
3. 查看 GitHub Actions 部署日志

---

## ✅ 配置检查清单

- [x] 本地 `.env.local` 文件已创建
- [ ] GitHub Secrets 已配置（需要您完成）
- [ ] 本地开发环境测试通过（需要您测试）
- [ ] 生产环境部署成功（需要您验证）
- [ ] 表单提交测试通过（需要您测试）

---

**配置完成后，您的联系表单将完全集成 Formspree，所有提交都会自动发送到您的邮箱！** 🎉
