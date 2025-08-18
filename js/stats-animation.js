// 统计卡片动画和交互效果
document.addEventListener('DOMContentLoaded', function() {
    
    // 获取所有统计卡片
    const statCards = document.querySelectorAll('.stat-card');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // 检查元素是否在视口中
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 数字计数动画
    function animateNumber(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.textContent.includes('%')) {
                element.textContent = Math.floor(current) + '%';
            } else if (element.textContent.includes('s')) {
                element.textContent = Math.floor(current) + 's';
            } else if (element.textContent === 'AI') {
                // AI保持不变
                return;
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // 统计卡片进入视口时的动画
    function animateStatsOnScroll() {
        statCards.forEach((card, index) => {
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                
                // 延迟动画，创造连续效果
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.8s ease forwards';
                    
                    // 数字计数动画
                    const numberElement = card.querySelector('.stat-number');
                    if (numberElement) {
                        const text = numberElement.textContent;
                        if (text.includes('98')) {
                            animateNumber(numberElement, 98);
                        } else if (text.includes('30')) {
                            animateNumber(numberElement, 30);
                        } else if (text.includes('6')) {
                            animateNumber(numberElement, 6);
                        }
                    }
                }, index * 200);
            }
        });
    }
    
    // 鼠标悬停效果增强
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.08)';
            this.style.boxShadow = '0 30px 60px rgba(0, 153, 230, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 15px 35px rgba(0, 153, 230, 0.2)';
        });
    });
    
    // 触摸设备优化
    if ('ontouchstart' in window) {
        statCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            card.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    // 滚动监听
    window.addEventListener('scroll', animateStatsOnScroll);
    
    // 页面加载完成后立即检查
    animateStatsOnScroll();
    
    // 添加AOS数据属性（如果使用AOS库）
    statCards.forEach((card, index) => {
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        card.setAttribute('data-aos-duration', '800');
    });
    
    // 性能优化：节流滚动事件
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(animateStatsOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // 添加CSS类用于样式控制
    statCards.forEach(card => {
        card.classList.add('stat-card-enhanced');
    });
    
    // 创建观察器用于更好的性能
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        statCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // 添加键盘导航支持
    statCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Product statistic: ' + card.querySelector('.stat-label').textContent);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // 添加加载状态指示器
    function showLoadingState() {
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            if (numberElement) {
                numberElement.style.opacity = '0.5';
            }
        });
    }
    
    function hideLoadingState() {
        statCards.forEach(card => {
            const numberElement = card.querySelector('.stat-number');
            if (numberElement) {
                numberElement.style.opacity = '1';
            }
        });
    }
    
    // 页面加载完成后隐藏加载状态
    window.addEventListener('load', hideLoadingState);
    
    // 添加错误处理
    window.addEventListener('error', function(e) {
        console.log('Stats animation error:', e);
        // 降级到静态显示
        statCards.forEach(card => {
            card.style.animation = 'none';
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    });
});
