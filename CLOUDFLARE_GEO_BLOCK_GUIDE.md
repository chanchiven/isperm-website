# Cloudflare 中国区域访问控制配置指南

本文档说明如何通过 Cloudflare 防火墙规则快速开关中国（CN）区域的访问。

---

## 一、前置条件

- 域名 `isperm.com` 已解析
- 网站通过 GitHub Pages 部署在 `www.isperm.com`

---

## 二、添加站点到 Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击 **Add a site**
3. 输入 `isperm.com`，选择 **Free** 计划
4. 按向导完成 DNS 记录导入/创建
5. 将域名 NS 记录改为 Cloudflare 提供的 nameservers（在域名注册商处修改）

---

## 三、创建防火墙规则

### 3.1 进入防火墙规则页面

1. 在 Cloudflare 控制台选择站点 `isperm.com`
2. 左侧菜单：**Security** → **WAF** → **Custom rules**

### 3.2 新建规则

1. 点击 **Create rule**
2. 填写：

| 字段 | 值 |
|------|-----|
| **Rule name** | `Block China Access` |
| **Field** | Country |
| **Operator** | equals |
| **Value** | China |
| **Action** | Block |

3. 点击 **Deploy**

### 3.3 规则表达式（高级）

如需自定义，可使用表达式编辑器：

```
(ip.geoip.country eq "CN")
```

- 仅阻止中国大陆：`(ip.geoip.country eq "CN")`
- 阻止中国大陆 + 台湾：`(ip.geoip.country in {"CN" "TW"})`
- 阻止中国大陆，但放行特定 IP：`(ip.geoip.country eq "CN" and not ip.src in {1.2.3.4 5.6.7.8})`

---

## 四、快速开关访问

### 方式一：控制台开关（推荐）

1. 进入 **Security** → **WAF** → **Custom rules**
2. 找到规则 `Block China Access`
3. 点击规则右侧的 **开关**：
   - **开启**：阻止中国区域访问
   - **关闭**：允许中国区域访问

生效时间：几秒内。

### 方式二：Cloudflare API（脚本/自动化）

#### 1. 创建 API Token

1. [My Profile](https://dash.cloudflare.com/profile/api-tokens) → **API Tokens**
2. **Create Token** → 使用 **Edit zone WAF** 模板
3. 权限需包含：`Zone` → `Firewall Services` → `Edit`
4. 保存 Token（只显示一次）

#### 2. 获取 Zone ID

- 站点概览页右侧 **API** 区域可看到 Zone ID

#### 3. 获取 Ruleset 和 Rule ID

WAF 自定义规则使用 **Config Rulesets**。获取 ID 需调用 API：

```bash
# 列出 zone 的 rulesets
curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

找到 `cloudflare_gateway` 或自定义 ruleset 的 ID，以及对应规则的 ID。

#### 4. 启用/禁用规则

```bash
# 禁用规则（解除对中国区域的阻止）
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/{ruleset_id}/rules/{rule_id}" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"enabled": false}'

# 启用规则（阻止中国区域）
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/rulesets/{ruleset_id}/rules/{rule_id}" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"enabled": true}'
```

> **注意**：Cloudflare WAF 自定义规则在较新版本中可能使用不同的 API 路径，具体以 [Cloudflare API 文档](https://developers.cloudflare.com/api/) 为准。

---

## 五、验证

### 阻止生效时

- 中国 IP 访问 `www.isperm.com` 应看到 Cloudflare 1020 / Access denied 等拦截页
- 非中国 IP 可正常访问

### 阻止关闭时

- 中国 IP 和非中国 IP 均可正常访问

### 测试建议

- 使用中国 VPN/代理测试中国 IP 行为
- 使用海外 VPN 或 [在线 IP 检测工具](https://www.whatismyip.com/) 确认当前 IP 归属

---

## 六、常见问题

### Q: 规则会影响香港、台湾吗？

默认只阻止 `CN`（中国大陆）。若需同时阻止台湾，在规则表达式中加入 `TW`。

### Q: 如何放行特定中国 IP（如办公室）？

在规则中使用例外，例如：

```
(ip.geoip.country eq "CN" and not ip.src in {办公室IP})
```

### Q: 被阻止的用户看到什么？

默认是 Cloudflare 的拦截页。可在 **Security** → **Settings** 中自定义 Block 页面的样式和文案。

### Q: 免费计划有限制吗？

Free 计划支持自定义 WAF 规则，满足本场景使用。

---

## 七、快速参考

| 操作 | 步骤 |
|------|------|
| **阻止中国访问** | WAF → Custom rules → 开启 `Block China Access` |
| **允许中国访问** | WAF → Custom rules → 关闭 `Block China Access` |
| **修改规则** | 点击规则名称进入编辑 |
