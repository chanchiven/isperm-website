// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Scrolling
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

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and product cards
document.querySelectorAll('.feature-card, .product-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Hero Carousel Functionality
(function() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let autoPlayInterval = null;
    const autoPlayDelay = 5000; // 5 seconds
    
    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay(); // Restart auto-play after manual navigation
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay(); // Restart auto-play after manual navigation
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay(); // Restart auto-play after manual navigation
        });
    });
    
    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            startAutoPlay();
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (carousel.querySelector('.active')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                startAutoPlay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                startAutoPlay();
            }
        }
    });
    
    // Start auto-play when page loads
    startAutoPlay();
})();

// Language Selector Functionality
(function() {
    // Get current language from URL path
    function getCurrentLanguage() {
        const path = window.location.pathname;
        const href = window.location.href;
        // Check both pathname and full href for /es/
        if (path.includes('/es/') || href.includes('/es/')) {
            return 'es';
        }
        return 'en';
    }
    
    // Get current page name
    function getCurrentPage() {
        const path = window.location.pathname;
        const href = window.location.href;
        const isLocalFile = window.location.protocol === 'file:';
        
        let cleanPath = path;
        
        // For local files, extract from full href
        if (isLocalFile) {
            // Extract the relative path from file:// URL
            const urlParts = href.split('/');
            const fileName = urlParts[urlParts.length - 1];
            if (fileName && fileName.includes('.')) {
                return fileName;
            }
            // If no file extension, it's likely index.html
            if (urlParts[urlParts.length - 1] === '' || urlParts[urlParts.length - 1] === 'es') {
                return 'index.html';
            }
        }
        
        // Remove language prefix if exists
        cleanPath = cleanPath.replace(/^\/es\//, '/');
        if (cleanPath === '/' || cleanPath === '') {
            return 'index.html';
        }
        const page = cleanPath.split('/').pop() || 'index.html';
        return page;
    }
    
    // Switch language
    function switchLanguage(lang) {
        const currentPage = getCurrentPage();
        const isLocalFile = window.location.protocol === 'file:';
        const currentLang = getCurrentLanguage();
        let newPath = '';
        
        if (lang === 'es') {
            // Switching to Spanish
            if (currentPage === 'index.html') {
                if (isLocalFile) {
                    newPath = 'es/index.html';
                } else {
                    newPath = '/es/';
                }
            } else {
                if (isLocalFile) {
                    // If already in es/, stay in es/, otherwise go to es/
                    if (currentLang === 'es') {
                        newPath = currentPage; // Already in es/, no change needed
                    } else {
                        newPath = `es/${currentPage}`;
                    }
                } else {
                    newPath = `/es/${currentPage}`;
                }
            }
        } else {
            // Switching to English
            if (currentPage === 'index.html') {
                if (isLocalFile) {
                    if (currentLang === 'es') {
                        newPath = '../index.html';
                    } else {
                        newPath = 'index.html'; // Already in root
                    }
                } else {
                    newPath = '/';
                }
            } else {
                if (isLocalFile) {
                    if (currentLang === 'es') {
                        // From es/ directory, go up one level
                        newPath = `../${currentPage}`;
                    } else {
                        newPath = currentPage; // Already in root
                    }
                } else {
                    newPath = `/${currentPage}`;
                }
            }
        }
        
        // Save language preference
        localStorage.setItem('preferredLanguage', lang);
        
        // Redirect to new language version
        window.location.href = newPath;
    }
    
    // Initialize language selector
    function initLanguageSelector() {
        const langToggle = document.getElementById('langToggle');
        const langMenu = document.getElementById('langMenu');
        const currentLang = getCurrentLanguage();
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (!langToggle || !langMenu) return;
        
        // Update current language display
        const currentLangSpan = document.getElementById('currentLang');
        if (currentLangSpan) {
            const langNames = {
                'en': 'English',
                'es': 'Español'
            };
            currentLangSpan.textContent = langNames[currentLang] || 'English';
        }
        
        // Update active state
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === currentLang) {
                option.classList.add('active');
            }
        });
        
        // Toggle menu
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.remove('active');
            }
        });
        
        // Handle language selection
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.dataset.lang;
                if (selectedLang !== currentLang) {
                    switchLanguage(selectedLang);
                } else {
                    langMenu.classList.remove('active');
                }
            });
        });
    }
    
    // Auto-detect language preference (only for Spanish, default to English for others)
    function autoDetectLanguage() {
        // Only run on homepage
        const path = window.location.pathname;
        const isHomepage = path === '/' || path === '/index.html' || path.endsWith('/') || path === '/es/' || path === '/es/index.html';
        
        if (!isHomepage) return;
        
        // Check if user has manually selected a language
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            const currentLang = getCurrentLanguage();
            // Only redirect if saved language differs from current
            if (savedLang !== currentLang) {
                switchLanguage(savedLang);
                return;
            }
        }
        
        // Auto-detect only on first visit (no saved preference) and only on homepage
        if (!savedLang && (path === '/' || path === '/index.html' || path.endsWith('/'))) {
            const browserLang = navigator.language || navigator.userLanguage;
            const langCode = browserLang.split('-')[0].toLowerCase();
            
            // Only redirect to Spanish if browser language is Spanish
            if (langCode === 'es') {
                switchLanguage('es');
            }
            // All other languages default to English (no redirect needed)
        }
    }
    
    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initLanguageSelector();
            // Small delay to ensure DOM is ready
            setTimeout(autoDetectLanguage, 100);
        });
    } else {
        initLanguageSelector();
        setTimeout(autoDetectLanguage, 100);
    }
})();

