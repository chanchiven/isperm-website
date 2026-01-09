# 修复 GitHub Pages 部署问题

## 问题 1: 行尾警告 (LF → CRLF)

已创建 `.gitattributes` 文件来自动处理行尾转换。这个文件会：
- 自动检测文本文件
- 统一使用 LF 行尾（Unix 风格）
- 二进制文件保持不变

**解决方案已完成** ✅

## 问题 2: 文件名过长错误

Windows 系统默认路径长度限制为 260 字符。以下文件夹名称过长：
- `The Authoritative Guide to Fish Semen Analysis Clinical Standards for Broodstock Management and Reproductive Success`

### 解决方案选项

#### 选项 A: 启用 Git 长路径支持（推荐）

在本地执行以下命令：

```bash
git config core.longpaths true
```

然后在 GitHub Actions 工作流中也启用（如果使用 CI/CD）。

#### 选项 B: 重命名文件夹（如果选项 A 不工作）

如果启用长路径后仍有问题，可以重命名文件夹并更新所有引用。

运行以下脚本：
```bash
python fix-long-paths.py
```

## 立即执行的步骤

1. **提交 `.gitattributes` 文件**：
   ```bash
   git add .gitattributes
   git commit -m "Add .gitattributes to normalize line endings"
   ```

2. **启用 Git 长路径支持**：
   ```bash
   git config core.longpaths true
   ```

3. **重新尝试提交**：
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

如果仍有问题，请运行 `fix-long-paths.py` 脚本。
