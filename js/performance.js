// Performance Optimization Utilities
class PerformanceManager {
    constructor() {
        this.lazyLoader = new LazyLoader();
        this.cacheManager = new CacheManager();
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.optimizeImages();
        this.setupIntersectionObserver();
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.lazyLoader.observe(img));
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Lazy Loading Implementation
class LazyLoader {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
    }

    observe(element) {
        this.observer.observe(element);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s';
        
        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.style.opacity = '1';
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        };
        tempImg.src = src;
    }
}

// Cache Management
class CacheManager {
    constructor() {
        this.cacheName = 'webtoolkit-v1';
        this.staticAssets = [
            '/',
            '/index.html',
            '/calculator.html',
            '/phonebook.html',
            '/gallery.html',
            '/about.html',
            '/css/main.css',
            '/js/main.js'
        ];
    }

    async cacheStaticAssets() {
        if ('caches' in window) {
            const cache = await caches.open(this.cacheName);
            await cache.addAll(this.staticAssets);
        }
    }

    async getCachedResponse(request) {
        if ('caches' in window) {
            return await caches.match(request);
        }
        return null;
    }
}

// Bundle Size Optimizer
class BundleOptimizer {
    static async loadModule(moduleName) {
        try {
            const module = await import(`/js/${moduleName}.js`);
            return module;
        } catch (error) {
            console.error(`Failed to load module: ${moduleName}`, error);
            return null;
        }
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Resource Preloader
class ResourcePreloader {
    static preloadCriticalResources() {
        const criticalResources = [
            { href: '/css/main.css', as: 'style' },
            { href: '/js/main.js', as: 'script' },
            { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = () => {
                    link.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    static prefetchNextPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }
}

// Initialize performance optimizations
const performanceManager = new PerformanceManager();

export { PerformanceManager, LazyLoader, BundleOptimizer, ResourcePreloader };