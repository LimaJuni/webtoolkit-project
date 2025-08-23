// Advanced Scroll Animations System

class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.counters = new Map();
    this.progressBars = new Map();
    this.init();
  }

  init() {
    this.setupScrollReveal();
    this.setupCounterAnimations();
    this.setupProgressBars();
    this.setupParallaxElements();
    this.setupTextReveal();
    this.createParticles();
  }

  // Main scroll reveal system
  setupScrollReveal() {
    const revealElements = document.querySelectorAll([
      '.scroll-reveal',
      '.scroll-reveal-stagger',
      '.scroll-reveal-left',
      '.scroll-reveal-right',
      '.scroll-reveal-scale',
      '.scroll-reveal-rotate'
    ].join(', '));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Animated counters
  setupCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.counters.has(entry.target)) {
          this.animateCounter(entry.target);
          this.counters.set(entry.target, true);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target) || parseInt(element.textContent);
    const duration = parseInt(element.dataset.duration) || 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  // Progress bar animations
  setupProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.progressBars.has(entry.target)) {
          const fill = entry.target.querySelector('.progress-fill');
          const percentage = fill.dataset.percentage || '100';
          
          setTimeout(() => {
            fill.style.width = percentage + '%';
          }, 200);
          
          this.progressBars.set(entry.target, true);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  // Enhanced parallax effects
  setupParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // Text reveal animations
  setupTextReveal() {
    const textElements = document.querySelectorAll('.text-reveal');
    
    textElements.forEach(element => {
      const text = element.textContent;
      element.innerHTML = `<span class="text-reveal-inner">${text}</span>`;
    });

    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.5 });

    textElements.forEach(el => textObserver.observe(el));
  }

  // Create floating particles
  createParticles() {
    const containers = document.querySelectorAll('.particle-container');
    
    containers.forEach(container => {
      const particleCount = parseInt(container.dataset.particles) || 20;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
      }
    });
  }

  // Utility: Add scroll reveal to element
  addScrollReveal(element, type = 'default', delay = 0) {
    element.classList.add(`scroll-reveal${type !== 'default' ? '-' + type : ''}`);
    if (delay > 0) {
      element.style.transitionDelay = delay + 's';
    }
  }

  // Utility: Create morphing blob
  createMorphingBlob(container, size = 200) {
    const blob = document.createElement('div');
    blob.className = 'morphing-blob';
    blob.style.width = size + 'px';
    blob.style.height = size + 'px';
    blob.style.position = 'absolute';
    blob.style.top = '50%';
    blob.style.left = '50%';
    blob.style.transform = 'translate(-50%, -50%)';
    blob.style.zIndex = '-1';
    container.appendChild(blob);
    return blob;
  }

  // Utility: Animate element on scroll
  animateOnScroll(element, animation, threshold = 0.1) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animation(entry.target);
        }
      });
    }, { threshold });

    observer.observe(element);
  }

  // Advanced: Scroll-triggered timeline
  createScrollTimeline(elements, options = {}) {
    const timeline = {
      elements: elements,
      duration: options.duration || 1000,
      easing: options.easing || 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      stagger: options.stagger || 100
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.elements.forEach((el, index) => {
            setTimeout(() => {
              el.style.transition = `all ${timeline.duration}ms ${timeline.easing}`;
              el.classList.add('revealed');
            }, index * timeline.stagger);
          });
        }
      });
    }, { threshold: 0.1 });

    // Observe the first element to trigger the timeline
    if (timeline.elements.length > 0) {
      observer.observe(timeline.elements[0]);
    }

    return timeline;
  }
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
  window.scrollAnimations = new ScrollAnimations();
});

// Export for use in other modules
export default ScrollAnimations;