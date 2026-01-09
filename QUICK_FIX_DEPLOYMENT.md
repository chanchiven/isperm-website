# 快速修复部署问题

## 问题说明

部署到 GitHub Pages 时遇到两个问题：
1. **行尾警告**：LF 将被替换为 CRLF
2. **文件名过长错误**：Windows 路径长度限制（260 字符）

## 已完成的修复

✅ 已创建 `.gitattributes` 文件来自动处理行尾转换
✅ 已更新 GitHub Actions 工作流以支持长路径

## 立即执行的步骤

### 步骤 1: 启用 Git 长路径支持（本地）

在 PowerShell 或命令提示符中执行：

```powershell
git config core.longpaths true
```

### 步骤 2: 提交更改

```powershell
git add .gitattributes
git add .github/workflows/deploy.yml
git commit -m "Fix: Add .gitattributes and enable long path support"
```

### 步骤 3: 重新添加所有文件并提交

```powershell
git add .
git commit -m "Your commit message"
git push
```

## 如果仍有问题

如果启用长路径后仍然遇到文件名过长错误，可以运行重命名脚本：

```powershell
python fix-long-paths.py
```

这个脚本会：
- 将过长的文件夹名称缩短
- 自动更新所有 JSON 文件中的路径引用

运行后检查更改，然后提交：

```powershell
git add .
git commit -m "Rename long folder names to fix Windows path limit"
git push
```

## 验证

提交后，检查 GitHub Actions 工作流是否成功运行。如果成功，问题已解决！
