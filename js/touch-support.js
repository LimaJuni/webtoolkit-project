// Touch and Mobile Support System
class TouchManager {
    constructor() {
        this.swipeThreshold = 50;
        this.tapTimeout = 300;
        this.init();
    }

    init() {
        this.setupSwipeGestures();
        this.setupTouchFeedback();
        this.setupMobileOptimizations();
    }

    setupSwipeGestures() {
        // Gallery swipe support
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            this.addSwipeSupport(item);
        });

        // Slideshow swipe support
        const slideshow = document.querySelector('.slideshow-container');
        if (slideshow) {
            this.addSlideshowSwipe(slideshow);
        }
    }

    addSwipeSupport(element) {
        let startX, startY, startTime;

        element.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            startTime = Date.now();
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const touch = e.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check if it's a swipe
            if (Math.abs(deltaX) > this.swipeThreshold && deltaTime < 500) {
                if (deltaX > 0) {
                    this.handleSwipeRight(element);
                } else {
                    this.handleSwipeLeft(element);
                }
            }

            startX = startY = null;
        }, { passive: true });
    }

    addSlideshowSwipe(slideshow) {
        let startX, currentSlide = 0;
        const slides = slideshow.querySelectorAll('.slide');

        slideshow.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        slideshow.addEventListener('touchend', (e) => {
            if (!startX) return;

            const endX = e.changedTouches[0].clientX;
            const deltaX = endX - startX;

            if (Math.abs(deltaX) > this.swipeThreshold) {
                if (deltaX > 0 && currentSlide > 0) {
                    currentSlide--;
                } else if (deltaX < 0 && currentSlide < slides.length - 1) {
                    currentSlide++;
                }
                this.updateSlideshow(slideshow, currentSlide);
            }

            startX = null;
        }, { passive: true });
    }

    updateSlideshow(slideshow, index) {
        const slides = slideshow.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
    }

    handleSwipeLeft(element) {
        // Navigate to next item or trigger action
        const nextBtn = element.querySelector('.next-btn');
        if (nextBtn) nextBtn.click();
    }

    handleSwipeRight(element) {
        // Navigate to previous item or trigger action
        const prevBtn = element.querySelector('.prev-btn');
        if (prevBtn) prevBtn.click();
    }

    setupTouchFeedback() {
        // Add touch feedback to buttons
        document.querySelectorAll('button, .btn, .nav-link').forEach(element => {
            element.addEventListener('touchstart', () => {
                element.classList.add('touch-active');
            }, { passive: true });

            element.addEventListener('touchend', () => {
                setTimeout(() => {
                    element.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    }

    setupMobileOptimizations() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Optimize scroll performance
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.no-scroll')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Mobile Layout Manager
class MobileLayoutManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        };
        this.init();
    }

    init() {
        this.setupViewportMeta();
        this.setupResponsiveImages();
        this.setupMobileNavigation();
        this.handleOrientationChange();
    }

    setupViewportMeta() {
        // Ensure proper viewport meta tag
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    setupResponsiveImages() {
        // Add responsive image loading
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    setupMobileNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('nav-open');
                }
            });
        }
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Recalculate layouts after orientation change
            setTimeout(() => {
                this.recalculateLayouts();
            }, 100);
        });
    }

    recalculateLayouts() {
        // Trigger layout recalculation
        const event = new Event('resize');
        window.dispatchEvent(event);
    }

    getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        if (width < this.breakpoints.desktop) return 'desktop';
        return 'large';
    }
}

// Touch-Optimized Components
class TouchOptimizedComponents {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeButtons();
        this.optimizeInputs();
        this.optimizeScrolling();
    }

    optimizeButtons() {
        // Ensure minimum touch target size (44px)
        document.querySelectorAll('button, .btn').forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                button.style.minWidth = '44px';
                button.style.minHeight = '44px';
            }
        });
    }

    optimizeInputs() {
        // Add appropriate input types for mobile
        document.querySelectorAll('input[type=\"text\"]').forEach(input => {
            const name = input.name || input.id || '';
            if (name.includes('email')) {
                input.type = 'email';
            } else if (name.includes('phone') || name.includes('tel')) {
                input.type = 'tel';
            } else if (name.includes('url')) {
                input.type = 'url';
            }
        });
    }

    optimizeScrolling() {
        // Add momentum scrolling for iOS
        document.querySelectorAll('.scrollable').forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
        });
    }
}

// Initialize touch and mobile support
const touchManager = new TouchManager();
const mobileLayoutManager = new MobileLayoutManager();
const touchOptimizedComponents = new TouchOptimizedComponents();

export { TouchManager, MobileLayoutManager, TouchOptimizedComponents };