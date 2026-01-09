# GitHub Pages 工作流切换指南

## 当前情况

您看到的消息：
> "Your site was last deployed to the github-pages environment by the pages build and deployment workflow"

这表明 GitHub 可能在使用**默认的 pages build and deployment 工作流**，而不是您的自定义工作流。

## 解决方案

### 方法 1: 直接选择 GitHub Actions（推荐）

**步骤：**

1. **在 GitHub Pages 设置页面**
   - 找到 **Source**（源）部分
   - 您会看到三个选项：
     - "Use a suggested workflow"（使用建议的工作流）
     - "Browse all workflows"（浏览所有工作流）
     - "Create your own"（创建自己的）

2. **选择 "Browse all workflows"**
   - 点击 "Browse all workflows"
   - 在列表中找到 **"Deploy to GitHub Pages"**（这是您的工作流名称）
   - 选择它

3. **或者直接选择 "GitHub Actions"**
   - 如果看到下拉菜单，直接选择 **"GitHub Actions"**
   - 然后选择 **"Deploy to GitHub Pages"** 工作流

4. **保存**
   - 点击 **Save**（保存）

---

### 方法 2: 如果看不到您的工作流

如果 "Browse all workflows" 中没有显示 "Deploy to GitHub Pages"，请：

1. **检查工作流文件是否存在**
   - 进入仓库的 **Actions** 标签
   - 应该能看到 "Deploy to GitHub Pages" 工作流
   - 如果看不到，说明工作流文件可能没有推送到 GitHub

2. **推送工作流文件（如果需要）**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add GitHub Pages deployment workflow"
   git push origin main
   ```

3. **等待几秒钟**
   - 推送后等待 10-30 秒
   - 刷新 GitHub Pages 设置页面
   - 现在应该能看到您的工作流了

---

### 方法 3: 禁用默认的 pages build and deployment

如果 GitHub 仍然使用默认工作流，需要禁用它：

1. **进入 Actions 标签**
   - 在仓库页面点击 **Actions**

2. **找到 "pages build and deployment" 工作流**
   - 在左侧工作流列表中查找
   - 如果存在，点击进入

3. **禁用工作流**
   - 点击右上角的 **...**（三个点）
   - 选择 **Disable workflow**（禁用工作流）

4. **确认禁用**
   - 确认禁用操作

---

## 验证设置

设置完成后，您应该看到：

### 在 GitHub Pages 设置中：
```
Source: GitHub Actions
Workflow: Deploy to GitHub Pages
```

### 在 Actions 标签中：
- ✅ "Deploy to GitHub Pages" 工作流显示为活跃
- ✅ 推送代码后会自动触发
- ❌ "pages build and deployment" 工作流被禁用（如果存在）

---

## 完整操作步骤（截图说明）

### 步骤 1: 进入设置
1. 仓库页面 → **Settings**
2. 左侧菜单 → **Pages**

### 步骤 2: 选择源
在 **Build and deployment** 部分：

**选项 A（推荐）：**
- 如果看到下拉菜单，直接选择 **"GitHub Actions"**
- 然后从下拉列表中选择 **"Deploy to GitHub Pages"**

**选项 B：**
- 点击 **"Browse all workflows"**
- 在列表中找到并选择 **"Deploy to GitHub Pages"**

### 步骤 3: 保存
- 点击 **Save**（保存）

### 步骤 4: 验证
- 进入 **Actions** 标签
- 应该看到 "Deploy to GitHub Pages" 工作流
- 推送代码后应该自动触发

---

## 如果仍然显示 README

如果切换后仍然显示 README 内容：

1. **等待部署完成**
   - 切换后，GitHub Actions 会自动触发部署
   - 等待 1-3 分钟

2. **检查 Actions 日志**
   - 进入 **Actions** 标签
   - 查看最新的 "Deploy to GitHub Pages" 运行
   - 确认构建成功（绿色 ✓）

3. **清除浏览器缓存**
   - 按 `Ctrl+Shift+R`（Windows）或 `Cmd+Shift+R`（Mac）
   - 强制刷新页面

4. **确认 `.nojekyll` 文件**
   - 确认 `public/.nojekyll` 文件已提交到仓库
   - 如果不存在，执行：
     ```bash
     git add public/.nojekyll
     git commit -m "Add .nojekyll file"
     git push
     ```

---

## 常见问题

### Q1: 看不到 "Deploy to GitHub Pages" 工作流

**原因：** 工作流文件可能没有推送到 GitHub

**解决：**
```bash
# 检查文件是否存在
ls .github/workflows/deploy.yml

# 如果存在，推送到 GitHub
git add .github/workflows/deploy.yml
git commit -m "Add deployment workflow"
git push origin main
```

---

### Q2: 选择工作流后没有反应

**原因：** 可能需要手动触发一次部署

**解决：**
1. 进入 **Actions** 标签
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 **Run workflow**
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow**

---

### Q3: 两个工作流同时运行

**原因：** 默认工作流没有被禁用

**解决：**
1. 进入 **Actions** 标签
2. 找到 "pages build and deployment" 工作流
3. 点击 **...** → **Disable workflow**
4. 确认禁用

---

## 预期结果

设置完成后：

✅ **GitHub Pages 设置显示：**
```
Source: GitHub Actions
Workflow: Deploy to GitHub Pages
```

✅ **Actions 标签显示：**
- "Deploy to GitHub Pages" 工作流活跃
- 推送代码后自动触发部署
- 构建成功（绿色 ✓）

✅ **网站正常显示：**
- 显示网站内容（不是 README）
- 所有功能正常工作

---

## 总结

**关键步骤：**
1. ✅ 在 GitHub Pages 设置中选择 **"GitHub Actions"**
2. ✅ 选择 **"Deploy to GitHub Pages"** 工作流
3. ✅ 点击 **Save**
4. ✅ 禁用默认的 "pages build and deployment" 工作流（如果存在）
5. ✅ 等待部署完成

**不需要：**
- ❌ 点击 "configure" 创建新工作流
- ❌ 使用 "Next.js by GitHub Actions" 模板
- ❌ 创建新的工作流文件

您的自定义工作流已经配置好了，只需要在设置中选择它即可！

---

**创建时间：** 2024年12月  
**状态：** ✅ 指南已创建
