// 地区访问控制脚本
// 检测用户地理位置并控制访问权限

(function() {
    'use strict';
    
    // 配置选项
    const config = {
        blockedCountries: ['CN'], // 被阻止的国家代码
        apiEndpoint: 'https://ipapi.co/json/', // IP地理位置API
        fallbackTimeout: 5000, // 备用检测超时时间
        allowOnError: false, // API失败时是否允许访问
        showDebugInfo: false // 是否显示调试信息
    };
    
    // 调试日志
    function log(message) {
        if (config.showDebugInfo) {
            console.log('[Region Block]:', message);
        }
    }
    
    // 显示访问被阻止页面
    function showAccessDenied() {
        log('Access denied - showing block page');
        
        // 保存原始页面内容（可选）
        if (!window.originalBodyContent) {
            window.originalBodyContent = document.body.innerHTML;
        }
        
        // 创建阻止页面
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
                    <h1 style="
                        margin: 0 0 20px 0;
                        font-size: 2.5rem;
                        font-weight: 300;
                        color: #fff;
                    ">⚠️ Access Restricted</h1>
                    
                    <p style="
                        font-size: 1.2rem;
                        line-height: 1.6;
                        margin: 0 0 30px 0;
                        opacity: 0.9;
                    ">We're sorry, but this website is not available in your current region.</p>
                    
                    <div style="
                        background: rgba(255, 255, 255, 0.2);
                        padding: 20px;
                        border-radius: 10px;
                        margin: 20px 0;
                    ">
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
                            If you believe this is an error, please contact our support team.
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px;">
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
                </div>
                
                <div style="
                    margin-top: 40px;
                    font-size: 0.8rem;
                    opacity: 0.6;
                ">
                    <p>iSperm - SQA-6100vet Veterinary CASA System</p>
                </div>
            </div>
        `;
        
        // 替换页面内容
        document.body.innerHTML = blockPage;
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 添加阻止访问标记
        document.body.setAttribute('data-access-blocked', 'true');
    }
    
    // 检测地理位置
    async function detectLocation() {
        try {
            log('Detecting user location...');
            
            const response = await fetch(config.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                timeout: config.fallbackTimeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            log('Location data received:', data);
            
            // 检查是否在被阻止的国家列表中
            if (data.country_code && config.blockedCountries.includes(data.country_code)) {
                log(`Access blocked for country: ${data.country_code}`);
                showAccessDenied();
                return false;
            }
            
            log(`Access allowed for country: ${data.country_code}`);
            return true;
            
        } catch (error) {
            log('Location detection failed:', error.message);
            
            if (!config.allowOnError) {
                log('Blocking access due to detection failure');
                showAccessDenied();
                return false;
            }
            
            log('Allowing access despite detection failure');
            return true;
        }
    }
    
    // 备用检测方法（基于时区）
    function fallbackDetection() {
        log('Using fallback detection method');
        
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            log('Detected timezone:', timezone);
            
            // 检查是否是中国时区
            if (timezone.includes('Asia/Shanghai') || timezone.includes('Asia/Urumqi')) {
                log('Access blocked based on timezone detection');
                showAccessDenied();
                return false;
            }
            
            log('Access allowed based on timezone detection');
            return true;
            
        } catch (error) {
            log('Fallback detection failed:', error.message);
            return config.allowOnError;
        }
    }
    
    // 初始化
    function init() {
        log('Initializing region block system...');
        
        // 检查是否已经被阻止
        if (document.body.getAttribute('data-access-blocked') === 'true') {
            log('Access already blocked, skipping detection');
            return;
        }
        
        // 尝试主要检测方法
        detectLocation().then(success => {
            if (!success) {
                log('Primary detection blocked access');
                return;
            }
            
            // 如果主要方法失败，使用备用方法
            if (success === undefined) {
                log('Primary detection failed, trying fallback');
                fallbackDetection();
            }
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 导出配置（可选）
    window.regionBlockConfig = config;
    
})();
