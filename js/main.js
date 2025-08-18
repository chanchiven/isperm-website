// Load navigation
$(document).ready(function() {
    // Check if jQuery is loaded
    if (typeof jQuery === 'undefined') {
        console.error('jQuery is not loaded!');
        return;
    }

    console.log('Attempting to load navigation...');
    
    // Get the current directory path
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const navPath = basePath + 'navigation.html';
    
    console.log('Navigation path:', navPath);

    // Load navigation with error handling
    $("#nav-placeholder").load("navigation.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading navigation:", xhr.status, xhr.statusText);
            return;
        }
        console.log('Navigation loaded successfully');
        initializeNavbar();
    });

    // Load footer
    $("#footer-placeholder").load("footer.html");

    // Initialize navigation functionality
    function initializeNavbar() {
        // 获取当前页面路径
        const currentPath = window.location.pathname;
        
        // 移除所有导航项的激活状态
        $('.nav-link').removeClass('active');
        
        // 根据当前路径设置激活状态
        $('.nav-link').each(function() {
            const linkPath = $(this).attr('href');
            if (linkPath && currentPath.includes(linkPath)) {
                $(this).addClass('active');
            }
        });

        // 初始化下拉菜单
        $('.dropdown-toggle').dropdown();

        // 处理导航栏滚动效果
        $(window).scroll(function() {
            if ($(this).scrollTop() > 50) {
                $('.navbar').addClass('navbar-scrolled');
            } else {
                $('.navbar').removeClass('navbar-scrolled');
            }
        });

        // 确保导航栏始终可见
        $('.navbar').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'right': '0',
            'z-index': '1000'
        });
    }

    // 页面加载完成后重新初始化导航栏
    $(window).on('load', function() {
        initializeNavbar();
    });

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Function to update active nav item
function updateActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.includes('products') && href === '/products.html') ||
            (currentPath.includes('about') && href === '/about.html') ||
            (currentPath.includes('contact') && href === '/contact.html')) {
            link.classList.add('active');
            
            // If it's a dropdown item, also highlight the parent
            if (link.classList.contains('dropdown-item')) {
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        }
    });
} 