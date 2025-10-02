// ================================
// Empirici Academy - Main JavaScript
// Modern, optimized, and accessible
// ================================

(function() {
    'use strict';

    // Cache DOM elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    // ================================
    // Header scroll effect
    // ================================
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ================================
    // Mobile menu toggle
    // ================================
    hamburger?.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navMenu?.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container') && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking nav links
    navMenu?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // ================================
    // Animated counter for stats
    // ================================
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // ================================
    // Intersection Observer for animations
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.slide-up, .stat-number').forEach(el => {
        observer.observe(el);
    });

    // ================================
    // Form validation helper
    // ================================
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        const inputs = form.querySelectorAll('[required]');

        inputs.forEach(input => {
            const errorElement = input.parentElement.querySelector('.form-error');
            
            if (!input.value.trim()) {
                input.classList.add('error');
                input.classList.remove('success');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                input.classList.add('error');
                input.classList.remove('success');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email';
                    errorElement.style.display = 'block';
                }
                isValid = false;
            } else {
                input.classList.remove('error');
                input.classList.add('success');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });

        return isValid;
    };

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ================================
    // Real-time form validation
    // ================================
    document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(input => {
        input.addEventListener('blur', function() {
            const errorElement = this.parentElement.querySelector('.form-error');
            
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.classList.add('error');
                this.classList.remove('success');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.display = 'block';
                }
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
                this.classList.remove('success');
                if (errorElement) {
                    errorElement.textContent = 'Please enter a valid email';
                    errorElement.style.display = 'block';
                }
            } else if (this.value) {
                this.classList.remove('error');
                this.classList.add('success');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });

        // Clear error on input
        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.remove('error');
                const errorElement = this.parentElement.querySelector('.form-error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
    });

    // ================================
    // Smooth scroll for anchor links
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ================================
    // Lazy load images
    // ================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ================================
    // Horizontal scroll helpers
    // ================================
    function enableSmoothScrolling() {
        const scrollContainers = document.querySelectorAll('.horizontal-scroll');
        
        scrollContainers.forEach(container => {
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                container.style.cursor = 'grabbing';
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });

            container.addEventListener('mouseleave', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mouseup', () => {
                isDown = false;
                container.style.cursor = 'grab';
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        });
    }

    // Enable on page load
    setTimeout(enableSmoothScrolling, 500);

    // ================================
    // Console message
    // ================================
    console.log('%c✓ Empirici Academy', 'color: #1B9AAA; font-size: 20px; font-weight: bold;');
    console.log('%cModern website loaded successfully!', 'color: #6B7280; font-size: 12px;');
})();
