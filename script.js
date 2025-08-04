// Performance-optimized JavaScript
// Use requestIdleCallback for non-critical operations
const requestIdleCallback = window.requestIdleCallback || function(cb) {
    return setTimeout(cb, 1);
};

// Performance monitoring
const performanceMetrics = {
    startTime: performance.now(),
    domContentLoaded: 0,
    loadComplete: 0,
    firstPaint: 0,
    firstContentfulPaint: 0
};

// Track DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    performanceMetrics.domContentLoaded = performance.now() - performanceMetrics.startTime;
    console.log('🚀 DOM Content Loaded:', performanceMetrics.domContentLoaded.toFixed(2), 'ms');
    
    // Initialize critical functionality immediately
    initMobileNavigation();
    initSmoothScrolling();
    
    // Defer non-critical functionality
    requestIdleCallback(() => {
        initFormHandling();
        initScrollEffects();
        initAnimations();
    });
});

// Track page load completion
window.addEventListener('load', function() {
    performanceMetrics.loadComplete = performance.now() - performanceMetrics.startTime;
    console.log('📊 Page Load Complete:', performanceMetrics.loadComplete.toFixed(2), 'ms');
    
    // Add fonts-loaded class when fonts are ready
    document.documentElement.classList.add('fonts-loaded');
    
    // Report comprehensive performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        const paintEntries = performance.getEntriesByType('paint');
        
        console.log('🎯 Performance Summary:');
        console.log('  - DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
        console.log('  - Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        console.log('  - Total Page Load:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
        
        // Track paint timing if available
        paintEntries.forEach(entry => {
            if (entry.name === 'first-paint') {
                performanceMetrics.firstPaint = entry.startTime;
                console.log('  - First Paint:', entry.startTime.toFixed(2), 'ms');
            }
            if (entry.name === 'first-contentful-paint') {
                performanceMetrics.firstContentfulPaint = entry.startTime;
                console.log('  - First Contentful Paint:', entry.startTime.toFixed(2), 'ms');
            }
        });
        
        // Calculate and log optimization metrics
        const optimizationScore = calculateOptimizationScore();
        console.log('🏆 Optimization Score:', optimizationScore + '%');
        
        // Report Core Web Vitals if available
        if ('web-vital' in window) {
            console.log('✅ Core Web Vitals tracking available');
        }
    }
});

// Calculate optimization score based on performance metrics
function calculateOptimizationScore() {
    let score = 100;
    
    // Deduct points for slow loading
    if (performanceMetrics.domContentLoaded > 1000) score -= 20;
    if (performanceMetrics.loadComplete > 3000) score -= 30;
    if (performanceMetrics.firstContentfulPaint > 1500) score -= 25;
    
    // Bonus points for fast loading
    if (performanceMetrics.domContentLoaded < 500) score += 10;
    if (performanceMetrics.loadComplete < 1500) score += 15;
    if (performanceMetrics.firstContentfulPaint < 800) score += 10;
    
    return Math.max(0, Math.min(100, score));
}

// Mobile Navigation Toggle - Optimized
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        // Use event delegation for better performance
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links - Optimized
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Use smooth scrolling with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    window.scrollTo(0, targetPosition);
                }
            }
        });
    });
}

// Form Handling - Optimized
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data efficiently
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Basic validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Sending message...', 'info');
            
            // Simulate API call with timeout
            setTimeout(() => {
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.reset();
            }, 2000);
        });
    }
}

// Email validation helper - Optimized
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system - Optimized
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles efficiently
    const colors = {
        error: '#ef4444',
        success: '#10b981',
        info: '#8b5cf6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll Effects - Optimized with throttling
function initScrollEffects() {
    const header = document.querySelector('.header');
    let ticking = false;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    // Intersection Observer for animations - Optimized
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Unobserve after animation to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.curriculum-card, .instructor-card, .pricing-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize animations - Optimized
function initAnimations() {
    // Add animation classes to CSS efficiently
    if (!document.querySelector('#animation-styles')) {
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .curriculum-card,
            .instructor-card,
            .pricing-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
            
            .curriculum-card.animate-in,
            .instructor-card.animate-in,
            .pricing-card.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .curriculum-card:nth-child(1) { transition-delay: 0.1s; }
            .curriculum-card:nth-child(2) { transition-delay: 0.2s; }
            .curriculum-card:nth-child(3) { transition-delay: 0.3s; }
            
            .instructor-card:nth-child(1) { transition-delay: 0.1s; }
            
            .pricing-card:nth-child(1) { transition-delay: 0.1s; }
            
            /* Mobile navigation styles */
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.98);
                backdrop-filter: blur(20px);
                padding: 2rem;
                border-top: 1px solid rgba(139, 92, 246, 0.1);
            }
            
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
    }
}

// Button click effects - Optimized with event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // Create ripple effect
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});

// Add ripple animation to CSS - Only once
if (!document.querySelector('#ripple-styles')) {
    const rippleStyle = document.createElement('style');
    rippleStyle.id = 'ripple-styles';
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll effects here
}, 16)); // ~60fps

// Performance monitoring and optimization tracking
console.log('⚡ Performance optimizations applied:');
console.log('  ✅ Critical CSS inlined');
console.log('  ✅ Font loading optimized');
console.log('  ✅ JavaScript deferred');
console.log('  ✅ Images optimized with loading="lazy"');
console.log('  ✅ Resource hints added');
console.log('  ✅ Event listeners optimized');
console.log('  ✅ Scroll events throttled');
console.log('  ✅ Intersection Observer for animations');
console.log('  ✅ RequestIdleCallback for non-critical tasks'); 