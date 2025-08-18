# 地区访问控制集成指南

## 🎯 实现目标
阻止来自中国(CN)的用户访问您的网站，显示专业的访问被阻止页面。

## 📋 集成步骤

### 步骤1: 选择集成方式

#### 方式A: 直接添加到HTML (推荐)
将以下代码添加到每个HTML页面的 `<head>` 部分，在 `<title>` 标签之后：

```html
<!-- 地区访问控制 -->
<script>
(function() {
    'use strict';
    
    // 配置
    const BLOCKED_COUNTRIES = ['CN']; // 被阻止的国家代码
    const API_ENDPOINT = 'https://ipapi.co/json/';
    const TIMEOUT = 5000;
    
    // 显示访问被阻止页面
    function showAccessDenied() {
        if (!window.originalBodyContent) {
            window.originalBodyContent = document.body.innerHTML;
        }
        
        const blockPage = `
            <div style="
                text-align: center; 
                padding: 50px 20px; 
                font-family: 'Microsoft YaHei', Arial, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 40px;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    max-width: 500px;
                    width: 90%;
                ">
                    <h1 style="margin: 0 0 20px 0; font-size: 2.5rem; font-weight: 300;">
                        ⚠️ Access Restricted
                    </h1>
                    
                    <p style="font-size: 1.2rem; line-height: 1.6; margin: 0 0 30px 0; opacity: 0.9;">
                        We're sorry, but this website is not available in your current region.
                    </p>
                    
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
                            If you believe this is an error, please contact our support team.
                        </p>
                    </div>
                    
                    <button onclick="window.history.back()" style="
                        background: rgba(255, 255, 255, 0.2);
                        border: 2px solid rgba(255, 255, 255, 0.3);
                        color: white;
                        padding: 12px 24px;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
                       onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        ← Go Back
                    </button>
                </div>
                
                <div style="margin-top: 40px; font-size: 0.8rem; opacity: 0.6;">
                    <p>iSperm - SQA-6100vet Veterinary CASA System</p>
                </div>
            </div>
        `;
        
        document.body.innerHTML = blockPage;
        document.body.style.overflow = 'hidden';
        document.body.setAttribute('data-access-blocked', 'true');
    }
    
    // 检测地理位置
    async function detectLocation() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
            
            const response = await fetch(API_ENDPOINT, {
                signal: controller.signal,
                headers: { 'Accept': 'application/json' }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.country_code && BLOCKED_COUNTRIES.includes(data.country_code)) {
                console.log(`Access blocked for country: ${data.country_code}`);
                showAccessDenied();
                return;
            }
            
            console.log(`Access allowed for country: ${data.country_code}`);
            
        } catch (error) {
            console.log('Location detection failed:', error.message);
            showAccessDenied();
        }
    }
    
    // 备用检测方法（基于时区）
    function fallbackDetection() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            
            if (timezone.includes('Asia/Shanghai') || timezone.includes('Asia/Urumqi')) {
                console.log('Access blocked based on timezone detection');
                showAccessDenied();
                return;
            }
            
            console.log('Access allowed based on timezone detection');
            
        } catch (error) {
            console.log('Fallback detection failed:', error.message);
            showAccessDenied();
        }
    }
    
    // 初始化
    function init() {
        if (document.body.getAttribute('data-access-blocked') === 'true') {
            return;
        }
        
        detectLocation().catch(() => {
            fallbackDetection();
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
</script>
```

#### 方式B: 外部JavaScript文件
1. 将 `js/region-block.js` 文件添加到您的项目中
2. 在每个HTML页面中添加：
```html
<script src="js/region-block.js"></script>
```

### 步骤2: 应用到所有页面

需要在以下页面中添加地区访问控制代码：
- `index.html` (主页)
- `about.html` (关于我们)
- `contact.html` (联系我们)

### 步骤3: 测试验证

#### 测试方法1: 使用VPN
- 连接到中国服务器
- 访问您的网站
- 应该看到访问被阻止页面

#### 测试方法2: 修改国家代码
临时修改代码中的 `BLOCKED_COUNTRIES` 数组：
```javascript
const BLOCKED_COUNTRIES = ['US']; // 临时阻止美国用户进行测试
```

#### 测试方法3: 浏览器开发者工具
- 打开开发者工具
- 查看Console日志
- 应该看到检测过程的日志信息

## ⚙️ 配置选项

### 基本配置
```javascript
const BLOCKED_COUNTRIES = ['CN']; // 被阻止的国家代码
const API_ENDPOINT = 'https://ipapi.co/json/'; // API端点
const TIMEOUT = 5000; // 超时时间(毫秒)
```

### 高级配置
```javascript
// 阻止多个国家
const BLOCKED_COUNTRIES = ['CN', 'HK', 'MO'];

// 使用不同的API服务
const API_ENDPOINT = 'https://ip-api.com/json/';

// 调整超时时间
const TIMEOUT = 10000; // 10秒
```

## 🔧 自定义阻止页面

### 修改样式
```javascript
// 在 showAccessDenied() 函数中修改 blockPage 变量
const blockPage = `
    <div style="
        /* 自定义样式 */
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        font-family: 'Your Font', sans-serif;
    ">
        <!-- 自定义内容 -->
    </div>
`;
```

### 添加多语言支持
```javascript
const messages = {
    'CN': {
        title: '访问受限',
        message: '抱歉，此网站在您所在的地区不可用。',
        button: '返回'
    },
    'EN': {
        title: 'Access Restricted',
        message: 'Sorry, this website is not available in your region.',
        button: 'Go Back'
    }
};
```

## ⚠️ 注意事项

### 1. API限制
- `ipapi.co` 有免费使用限制
- 建议监控API使用情况
- 考虑备用API服务

### 2. 性能影响
- 每次页面加载都会进行API调用
- 可能增加页面加载时间
- 建议添加缓存机制

### 3. 用户体验
- 阻止页面应该专业友好
- 提供联系方式和错误报告渠道
- 考虑添加白名单机制

### 4. 法律合规
- 确保符合当地法律法规
- 考虑数据隐私问题
- 提供用户申诉渠道

## 🚀 部署建议

### 1. 分阶段部署
- 先在测试环境验证
- 逐步应用到生产环境
- 监控用户反馈

### 2. 监控和分析
- 记录阻止访问的统计
- 监控API调用频率
- 分析用户地理分布

### 3. 备用方案
- 准备备用API服务
- 实现本地检测机制
- 建立故障恢复流程

## 📞 技术支持

如果在集成过程中遇到问题：
1. 检查浏览器Console错误信息
2. 验证API服务是否可用
3. 测试网络连接和防火墙设置
4. 联系技术支持团队
