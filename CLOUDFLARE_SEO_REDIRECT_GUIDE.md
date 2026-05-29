# Cloudflare SEO 重定向与爬虫放行配置指南

本文档说明如何在 Cloudflare 中配置 **301 永久重定向**、**放行 Googlebot**，以减少 Search Console 中「网页会自动重定向」的误报，并帮助 Google 正确收录 `https://www.isperm.com/en/` 等正式 URL。

---

## 背景

站点使用 `trailingSlash: true`，正式 URL 均带尾斜杠，例如：

- ✅ `https://www.isperm.com/en/`
- ✅ `https://www.isperm.com/en/products/nexus-dx1/`
- ❌ `https://www.isperm.com/en`（无尾斜杠 → 会跳转，Google 不收录此版本）
- ❌ `https://isperm.com/`（无 www → 应 301 到 www）

Search Console 中「178 个网页会自动重定向」多数为**无尾斜杠或非 www 的中间 URL**，属于预期行为；配置 301 与放行爬虫可加速 Google 收录**最终 URL**。

---

## 一、DNS 前置检查

在 Cloudflare → **DNS** → **Records** 中确认：

| 类型 | 名称 | 内容 | 代理状态 |
|------|------|------|----------|
| CNAME 或 A | `www` | GitHub Pages / Pages 目标 | 已代理（橙色云） |
| A 或 CNAME | `@`（根域名 isperm.com） | 指向 Pages 或 Cloudflare 重定向 | 已代理 |

根域名 `@` 必须能解析，否则 `https://isperm.com` 无法统一跳转到 `www`。

---

## 二、301：无 www → 有 www（必做）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com) → 选择 **isperm.com**
2. 左侧：**Rules** → **Redirect Rules**（或 **Bulk Redirects**）
3. 点击 **Create rule**

| 字段 | 值 |
|------|-----|
| **Rule name** | `SEO - apex to www 301` |
| **When incoming requests match** | Custom filter expression |
| **Expression** | `(http.host eq "isperm.com")` |
| **Then** | Dynamic redirect |
| **Expression** | `concat("https://www.isperm.com", http.request.uri.path)` |
| **Status code** | **301** |
| **Preserve query string** | 开启 |

若 Query String 需保留，使用：

```
concat("https://www.isperm.com", http.request.uri.path, http.request.uri.query != "" ? concat("?", http.request.uri.query) : "")
```

**验证：**

```bash
curl -I https://isperm.com/
# 应返回 301，Location: https://www.isperm.com/...
```

---

## 三、301：根路径 `/` → `/en/`（推荐）

当前根路径可能返回 **302**，建议改为 **301**，将权重集中到英文首页。

| 字段 | 值 |
|------|-----|
| **Rule name** | `SEO - root to en 301` |
| **Expression** | `(http.host eq "www.isperm.com" and http.request.uri.path eq "/")` |
| **Then** | Static redirect |
| **URL** | `https://www.isperm.com/en/` |
| **Status code** | **301** |

> 若与 Pages 自带跳转冲突，可只保留 Cloudflare 规则或只保留源站跳转，避免双重重定向链。

**验证：**

```bash
curl -I https://www.isperm.com/
# 期望：301 → Location: https://www.isperm.com/en/
```

---

## 四、301：无尾斜杠 → 有尾斜杠（可选）

仅当 Cloudflare/Pages **未**自动补尾斜杠时再添加。表达式需**排除**带扩展名的静态文件（`.xml`、`.webp`、`.svg` 等）。

| 字段 | 值 |
|------|-----|
| **Rule name** | `SEO - add trailing slash 301` |
| **Expression** | 见下方 |

```
(
  http.host eq "www.isperm.com"
  and not http.request.uri.path matches ".*\\.[a-zA-Z0-9]+$"
  and not ends_with(http.request.uri.path, "/")
)
```

| **Then** | Dynamic redirect |
| **Expression** | `concat("https://www.isperm.com", http.request.uri.path, "/")` |
| **Status code** | **301** |

**验证：**

```bash
curl -I https://www.isperm.com/en
# 期望：301 → https://www.isperm.com/en/

curl -I https://www.isperm.com/sitemap.xml
# 期望：200（不应被加斜杠）
```

---

## 五、放行 Googlebot（必做，避免 403）

若 Google 抓取返回 Cloudflare「Sorry, you have been blocked」，需在 WAF 中放行已验证爬虫。

### 5.1 开启 Verified Bots

1. **Security** → **Bots**
2. 确认 **Allow verified bots** 为开启状态

### 5.2 WAF 跳过规则（推荐）

1. **Security** → **WAF** → **Custom rules** → **Create rule**

| 字段 | 值 |
|------|-----|
| **Rule name** | `Allow verified search bots` |
| **Expression** | `(cf.client.bot)` 或 `(http.user_agent contains "Googlebot")` |
| **Action** | **Skip** → 选择跳过 **All remaining custom rules**（或 All super bot fight mode rules） |

将此类规则排在 **Block China Access** 等拦截规则**之前**（优先级更高）。

### 5.3 检查 Bot Fight Mode

1. **Security** → **Bots** → **Bot Fight Mode**
2. 若开启后 Google 仍被拦，建议关闭，或确保 Verified Bots 已放行

**验证：**

```bash
curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://www.isperm.com/en/
# 期望：200 OK（不是 403）
```

---

## 六、SSL / HTTPS

1. **SSL/TLS** → **Overview** → 加密模式：**Full** 或 **Full (strict)**
2. **SSL/TLS** → **Edge Certificates** → 开启 **Always Use HTTPS**

---

## 七、Google Search Console 操作

配置完成后：

1. **站点地图** → 提交 `https://www.isperm.com/sitemap.xml`
2. **网址检查** → 输入 `https://www.isperm.com/en/`（**带尾斜杠**）
3. 点击 **请求编入索引**
4. 勿以 `https://www.isperm.com/en`（无斜杠）作为收录目标

---

## 八、推荐规则优先级（从上到下）

| 顺序 | 规则名 | 作用 |
|------|--------|------|
| 1 | Allow verified search bots | 放行 Googlebot |
| 2 | SEO - apex to www 301 | isperm.com → www |
| 3 | SEO - root to en 301 | / → /en/ |
| 4 | SEO - add trailing slash 301 | 可选，补尾斜杠 |
| 5 | Block China Access | 业务地域限制（若有） |

---

## 九、常见问题

### Q: 「178 个重定向」会消失吗？

不会立刻清零。Google 重新抓取后，无尾斜杠 URL 仍会显示「重定向」；**带尾斜杠的最终 URL 被收录**即可。数量会随时间下降。

### Q: 该检查哪个 URL？

始终检查带尾斜杠的正式地址，例如 `https://www.isperm.com/en/products/nexus-dx1/`。

### Q: 301 和 302 有什么区别？

301 表示永久迁移，Google 会把权重转给目标 URL；302 为临时跳转，权重传递较弱。SEO 场景应优先 301。

### Q: robots.txt 里的 Google-Extended Disallow 会影响搜索吗？

不会。`Google-Extended` 仅限制 AI 训练爬虫，**不影响** Google 搜索用的 Googlebot。

---

## 十、快速检查清单

- [ ] `https://isperm.com/` → 301 → `https://www.isperm.com/...`
- [ ] `https://www.isperm.com/` → 301 → `https://www.isperm.com/en/`
- [ ] `https://www.isperm.com/en` → 301 → `https://www.isperm.com/en/`
- [ ] Googlebot 访问 `/en/` 返回 **200**
- [ ] GSC 已提交 `sitemap.xml`
- [ ] GSC 网址检查使用 **带尾斜杠** URL

---

**相关文档：** [CLOUDFLARE_GEO_BLOCK_GUIDE.md](./CLOUDFLARE_GEO_BLOCK_GUIDE.md)
