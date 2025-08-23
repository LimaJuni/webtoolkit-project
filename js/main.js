// Main JavaScript entry point for WebToolKit Enhanced

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
    // Theme management will be implemented in later tasks
    console.log('Design system initialized');
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
}

// Initialize design system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DesignSystem();
});

// Export for use in other modules
export default DesignSystem;