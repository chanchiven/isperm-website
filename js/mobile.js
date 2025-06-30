// 移动端优化JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 为移动设备添加类名
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
    
    // 移动端导航栏优化
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // 点击导航链接后自动关闭菜单
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
        
        // 点击外部区域关闭菜单
        document.addEventListener('click', (e) => {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
    
    // 移动端滚动优化
    let ticking = false;
    
    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // 移动端图片懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 移动端触摸反馈
    if (isTouch) {
        const touchElements = document.querySelectorAll('.product-card, .btn, .nav-link');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }
    
    // 移动端性能优化
    // 减少重绘和回流
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.willChange = 'transform';
    });
    
    // 移动端字体大小调整
    function adjustFontSize() {
        const vw = window.innerWidth;
        const baseSize = Math.max(16, Math.min(vw * 0.04, 20)); // 最小16px，最大20px
        document.documentElement.style.fontSize = baseSize + 'px';
    }
    
    // 只在移动端调整字体
    if (isMobile) {
        adjustFontSize();
        window.addEventListener('resize', adjustFontSize);
    }
    
    // 移动端滚动平滑
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考虑固定导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 移动端表单优化
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // 防止iOS缩放
            if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
                input.style.fontSize = '16px';
            }
            
            // 添加焦点样式
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    });
    
    // 移动端图片查看器
    const images = document.querySelectorAll('.gallery-image, .product-card img');
    images.forEach(img => {
        img.addEventListener('click', function() {
            if (isMobile) {
                // 创建全屏图片查看器
                const viewer = document.createElement('div');
                viewer.className = 'image-viewer';
                viewer.innerHTML = `
                    <div class="image-viewer-content">
                        <img src="${this.src}" alt="${this.alt}">
                        <button class="image-viewer-close">&times;</button>
                    </div>
                `;
                
                viewer.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                const content = viewer.querySelector('.image-viewer-content');
                content.style.cssText = `
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                `;
                
                const closeBtn = viewer.querySelector('.image-viewer-close');
                closeBtn.style.cssText = `
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 30px;
                    cursor: pointer;
                `;
                
                document.body.appendChild(viewer);
                
                // 关闭查看器
                const closeViewer = () => {
                    document.body.removeChild(viewer);
                };
                
                closeBtn.addEventListener('click', closeViewer);
                viewer.addEventListener('click', function(e) {
                    if (e.target === viewer) {
                        closeViewer();
                    }
                });
            }
        });
    });
    
    // 移动端错误处理
    window.addEventListener('error', function(e) {
        console.error('Mobile error:', e.error);
    });
    
    // 移动端网络状态检测
    if ('navigator' in window && 'connection' in navigator) {
        const connection = navigator.connection;
        
        function updateConnectionInfo() {
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                // 低网速优化
                document.body.classList.add('slow-connection');
            }
        }
        
        connection.addEventListener('change', updateConnectionInfo);
        updateConnectionInfo();
    }
});

// 移动端PWA支持
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 