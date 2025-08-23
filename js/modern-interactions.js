// Modern Interactions - Enhanced User Experience

class ModernInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupCustomCursor();
    this.setupMagneticEffects();
    this.setupScrollAnimations();
    this.setupStaggeredAnimations();
    this.setupParallaxEffects();
    this.setupSmoothTransitions();
    this.setupInteractiveCards();
    this.setupScrollProgress();
    this.setupStickyNavigation();
  }

  // Custom Cursor Effect
  setupCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive-card, .magnetic');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  // Magnetic Effect for Interactive Elements
  setupMagneticEffects() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Smooth Scroll Animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal', 'visible');
        }
      });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
  }

  // Staggered Animation System
  setupStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    staggerContainers.forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('animate');
              }, index * 100);
            });
          }
        });
      }, { threshold: 0.3 });

      observer.observe(container);
    });
  }

  // Parallax Effects
  setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Smooth Page Transitions
  setupSmoothTransitions() {
    const links = document.querySelectorAll('a[href^="#"], a[href^="./"], a[href^="/"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Handle internal links
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
        
        // Handle page transitions
        if (href.endsWith('.html') || href.includes('#')) {
          this.createPageTransition();
        }
      });
    });
  }

  // Create smooth page transition
  createPageTransition() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    // Trigger transition
    requestAnimationFrame(() => {
      transition.classList.add('active');
    });

    // Remove transition after animation
    setTimeout(() => {
      transition.remove();
    }, 800);
  }

  // Interactive Card Enhancements
  setupInteractiveCards() {
    const cards = document.querySelectorAll('.interactive-card');
    
    cards.forEach(card => {
      // Add tilt effect on mouse move
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });

      // Reset transform on mouse leave
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      });

      // Add click ripple effect
      card.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = (e.clientX - card.offsetLeft) + 'px';
        ripple.style.top = (e.clientY - card.offsetTop) + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Utility: Add floating animation to elements
  addFloatingAnimation(selector, delay = 0) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.style.animationDelay = `${delay + index * 0.2}s`;
      el.classList.add('floating');
    });
  }

  // Utility: Add loading state
  addLoadingState(element) {
    element.classList.add('loading');
  }

  // Utility: Remove loading state
  removeLoadingState(element) {
    element.classList.remove('loading');
  }

  // Scroll Progress Indicator
  setupScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // Sticky Navigation with Scroll Effects
  setupStickyNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      // Add scrolled class for styling
      if (scrollTop > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Hide/show navigation on scroll
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });

    // Show navigation on mouse move
    let mouseTimeout;
    document.addEventListener('mousemove', () => {
      nav.style.transform = 'translateY(0)';
      clearTimeout(mouseTimeout);
      
      mouseTimeout = setTimeout(() => {
        if (window.pageYOffset > 100) {
          nav.style.transform = 'translateY(-100%)';
        }
      }, 3000);
    });
  }
}

// Initialize modern interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModernInteractions();
});

// Export for use in other modules
window.ModernInteractions = ModernInteractions; 