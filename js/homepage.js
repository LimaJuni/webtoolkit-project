// Homepage Enhanced Functionality

class Slideshow {
  constructor(container) {
    this.container = container;
    this.slides = container.querySelectorAll('.slide');
    this.indicators = container.querySelectorAll('.indicator');
    this.prevBtn = container.querySelector('.prev-btn');
    this.nextBtn = container.querySelector('.next-btn');
    this.currentSlide = 0;
    this.isAutoPlaying = true;
    this.autoPlayInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }

  init() {
    this.setupControls();
    this.setupKeyboardNavigation();
    this.setupTouchNavigation();
    this.setupAutoPlay();
    this.setupAccessibility();
  }

  setupControls() {
    this.prevBtn?.addEventListener('click', () => this.previousSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });
  }

  setupKeyboardNavigation() {
    this.container.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoPlay();
          break;
      }
    });
  }

  setupTouchNavigation() {
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  setupAutoPlay() {
    this.startAutoPlay();
    
    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
    this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoPlay();
      } else if (this.isAutoPlaying) {
        this.startAutoPlay();
      }
    });
  }

  setupAccessibility() {
    // Add ARIA labels
    this.container.setAttribute('aria-label', 'Image slideshow');
    this.container.setAttribute('role', 'region');
    
    this.slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== this.currentSlide);
    });
  }

  goToSlide(index) {
    if (index === this.currentSlide) return;
    
    const prevIndex = this.currentSlide;
    this.currentSlide = index;
    
    // Update slides
    this.slides[prevIndex].classList.remove('active');
    this.slides[this.currentSlide].classList.add('active');
    
    // Update indicators
    this.indicators[prevIndex]?.classList.remove('active');
    this.indicators[this.currentSlide]?.classList.add('active');
    
    // Update accessibility
    this.slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== this.currentSlide);
    });
    
    // Announce to screen readers
    this.announceSlideChange();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoPlay() {
    this.pauseAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  toggleAutoPlay() {
    this.isAutoPlaying = !this.isAutoPlaying;
    if (this.isAutoPlaying) {
      this.startAutoPlay();
    } else {
      this.pauseAutoPlay();
    }
  }

  announceSlideChange() {
    const slideText = this.slides[this.currentSlide].querySelector('.slide-text h3')?.textContent;
    if (slideText) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = `Slide ${this.currentSlide + 1}: ${slideText}`;
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }
}

class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('[data-animate]');
    this.observer = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.observeElements();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, options);
  }

  observeElements() {
    this.animatedElements.forEach(element => {
      this.observer.observe(element);
    });
  }

  animateElement(element) {
    const animationType = element.dataset.animate;
    const delay = element.dataset.delay || 0;
    
    setTimeout(() => {
      element.classList.add('animate-in', animationType);
    }, parseInt(delay));
    
    // Stop observing once animated
    this.observer.unobserve(element);
  }
}

class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupHoverEffects();
    this.setupClickEffects();
    this.setupFocusEffects();
  }

  setupHoverEffects() {
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.addRippleEffect(e.target, 'hover');
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.slide-btn, .feature-link');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        this.addGlowEffect(e.target);
      });
      
      button.addEventListener('mouseleave', (e) => {
        this.removeGlowEffect(e.target);
      });
    });
  }

  setupClickEffects() {
    const clickableElements = document.querySelectorAll('.slide-btn, .indicator, .feature-link');
    clickableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.addClickRipple(e);
      });
    });
  }

  setupFocusEffects() {
    const focusableElements = document.querySelectorAll('button, a, [tabindex]');
    focusableElements.forEach(element => {
      element.addEventListener('focus', (e) => {
        this.addFocusGlow(e.target);
      });
      
      element.addEventListener('blur', (e) => {
        this.removeFocusGlow(e.target);
      });
    });
  }

  addRippleEffect(element, type) {
    element.style.transform = 'scale(1.02)';
    element.style.transition = 'transform 0.3s ease';
  }

  addGlowEffect(element) {
    element.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)';
    element.style.transition = 'box-shadow 0.3s ease';
  }

  removeGlowEffect(element) {
    element.style.boxShadow = '';
  }

  addClickRipple(event) {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
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

  addFocusGlow(element) {
    element.style.outline = '2px solid var(--color-primary-500)';
    element.style.outlineOffset = '2px';
  }

  removeFocusGlow(element) {
    element.style.outline = '';
    element.style.outlineOffset = '';
  }
}

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeAnimations();
    this.setupPreloadHints();
  }

  setupLazyLoading() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeAnimations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }

  setupPreloadHints() {
    // Preload critical resources
    const criticalResources = [
      'css/homepage.css',
      'js/homepage.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }
}

// Initialize homepage functionality
document.addEventListener('DOMContentLoaded', () => {
  // Initialize slideshow
  const slideshowContainer = document.querySelector('.slideshow-container');
  if (slideshowContainer) {
    new Slideshow(slideshowContainer);
  }

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize micro-interactions
  new MicroInteractions();

  // Initialize performance optimizations
  new PerformanceOptimizer();

  // Add CSS animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});

// Export classes for potential use in other modules
export { Slideshow, ScrollAnimations, MicroInteractions, PerformanceOptimizer };