// Main JavaScript entry point for WebToolKit Enhanced

// Navigation component
export class Navigation {
  constructor() {
    this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.isMenuOpen = false;
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupCurrentPageHighlighting();
    this.setupKeyboardNavigation();
    this.setupAccessibility();
  }

  setupMobileMenu() {
    if (!this.mobileMenuBtn || !this.navMenu) return;

    this.mobileMenuBtn.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.navMenu.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
        this.mobileMenuBtn.focus();
      }
    });

    // Close menu when window is resized to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMenuOpen = true;
    this.navMenu.classList.add('active');
    this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    
    // Focus first nav link
    const firstNavLink = this.navMenu.querySelector('.nav-link');
    if (firstNavLink) {
      firstNavLink.focus();
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;
    this.navMenu.classList.remove('active');
    this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  setupCurrentPageHighlighting() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    this.navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Remove active class from all links first
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      // Add active class to current page link
      if (linkPath === currentPage || 
          (currentPage === '' && linkPath === 'index.html') ||
          (currentPage === 'index.html' && linkPath === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  setupKeyboardNavigation() {
    this.navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (index + 1) % this.navLinks.length;
          this.navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
          this.navLinks[prevIndex].focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          this.navLinks[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          this.navLinks[this.navLinks.length - 1].focus();
        }
      });
    });
  }

  setupAccessibility() {
    // Announce navigation changes to screen readers
    const navElement = document.querySelector('.main-nav');
    if (navElement) {
      navElement.setAttribute('aria-label', 'Main navigation');
    }

    // Ensure proper focus management
    this.navLinks.forEach(link => {
      link.addEventListener('focus', () => {
        // Ensure focused link is visible in mobile menu
        if (this.isMenuOpen && window.innerWidth < 768) {
          link.scrollIntoView({ block: 'nearest' });
        }
      });
    });
  }
}

// Design system utilities
export class DesignSystem {
  constructor() {
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupAnimations();
    this.setupAccessibility();
  }

  setupTheme() {
    // Theme management
    this.initThemeToggle();
  }

  setupAnimations() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty('--transition-fast', '0ms');
      document.documentElement.style.setProperty('--transition-base', '0ms');
      document.documentElement.style.setProperty('--transition-slow', '0ms');
    }
  }

  setupAccessibility() {
    // Enhanced focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle?.querySelector('.theme-icon');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('webtoolkit_theme') || 'light';
    this.setTheme(savedTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('webtoolkit_theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
    
    // Dispatch theme change event for gamification
    document.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DesignSystem();
  new Navigation();
});

// Export for use in other modules
export { DesignSystem, Navigation };
export default DesignSystem;