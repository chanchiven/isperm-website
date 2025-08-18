# GitHub Pages 部署指南

## 📋 部署步骤

### 1. 创建GitHub仓库

1. 登录GitHub账户
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `isperm-website` (或您喜欢的名称)
   - **Description**: iSperm - Fully Automated CASA System Website
   - **Visibility**: Public (GitHub Pages需要公开仓库)
   - **Initialize this repository with**: 勾选 "Add a README file"
4. 点击 "Create repository"

### 2. 上传网站文件

#### 方法一：使用Git命令行

```bash
# 克隆仓库到本地
git clone https://github.com/您的用户名/isperm-website.git

# 进入仓库目录
cd isperm-website

# 复制所有网站文件到仓库目录
# (将您的网站文件复制到这里)

# 添加所有文件到Git
git add .

# 提交更改
git commit -m "Initial website upload"

# 推送到GitHub
git push origin main
```

#### 方法二：使用GitHub Desktop

1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录GitHub账户
3. 克隆刚创建的仓库
4. 将网站文件复制到仓库目录
5. 在GitHub Desktop中提交并推送更改

#### 方法三：直接在GitHub网页上传

1. 在GitHub仓库页面，点击 "Add file" → "Upload files"
2. 拖拽或选择所有网站文件
3. 添加提交信息
4. 点击 "Commit changes"

### 3. 启用GitHub Pages

1. 在GitHub仓库页面，点击 "Settings" 标签
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分：
   - 选择 "Deploy from a branch"
   - Branch选择 "gh-pages" (如果使用GitHub Actions) 或 "main"
   - Folder选择 "/ (root)"
4. 点击 "Save"

### 4. 配置自定义域名（可选）

如果您有自己的域名：

1. 在GitHub Pages设置中，在 "Custom domain" 部分输入您的域名
2. 勾选 "Enforce HTTPS"
3. 在您的域名提供商处添加DNS记录：
   - 类型：CNAME
   - 名称：www (或您想要的子域名)
   - 值：您的GitHub用户名.github.io

## 🔧 文件结构

确保您的网站文件结构如下：

```
isperm-website/
├── index.html
├── about.html
├── contact.html
├── products.html
├── products/
│   ├── SQA-6100vet.html
│   ├── FragScope.html
│   ├── Martest.html
│   └── MorphoBlue.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── (所有图片文件)
├── sitemap.xml
├── robots.txt
├── README.md
└── .github/
    └── workflows/
        └── deploy.yml
```

## 🌐 访问网站

部署完成后，您的网站将在以下地址可用：

- **GitHub Pages URL**: `https://您的用户名.github.io/isperm-website/`
- **自定义域名** (如果配置): `https://您的域名.com`

## 📊 监控部署状态

1. 在GitHub仓库页面，点击 "Actions" 标签
2. 查看部署工作流的状态
3. 绿色勾表示部署成功，红色叉表示有错误

## 🔄 更新网站

每次您想要更新网站时：

1. 修改本地文件
2. 提交并推送到GitHub：
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. GitHub Actions会自动重新部署网站

## 🛠️ 故障排除

### 常见问题

1. **网站无法访问**
   - 检查GitHub Pages是否已启用
   - 确认仓库是公开的
   - 等待几分钟让部署完成

2. **图片无法显示**
   - 检查图片路径是否正确
   - 确认图片文件已上传到GitHub

3. **样式无法加载**
   - 检查CSS文件路径
   - 确认文件已正确上传

4. **部署失败**
   - 检查GitHub Actions日志
   - 确认所有文件路径正确

## 📞 获取帮助

如果遇到问题：
1. 查看GitHub Pages文档
2. 检查GitHub Actions日志
3. 在GitHub Issues中搜索类似问题

## 🎉 完成！

恭喜！您的iSperm网站现在已经成功部署到GitHub Pages上了！ 