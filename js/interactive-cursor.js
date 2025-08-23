// Interactive Cursor System - Inspired by Modern Agency Sites

class InteractiveCursor {
  constructor() {
    this.cursor = null;
    this.cursorFollower = null;
    this.isHovering = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.followerX = 0;
    this.followerY = 0;
    this.magneticElements = [];
    
    this.init();
  }

  init() {
    this.createCursor();
    this.setupEventListeners();
    this.setupMagneticElements();
    this.animate();
  }

  createCursor() {
    // Main cursor dot
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.cursor.innerHTML = '<div class="cursor-dot"></div>';
    
    // Cursor follower
    this.cursorFollower = document.createElement('div');
    this.cursorFollower.className = 'cursor-follower';
    
    document.body.appendChild(this.cursor);
    document.body.appendChild(this.cursorFollower);
  }

  setupEventListeners() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      this.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Interactive elements
    const interactiveElements = document.querySelectorAll([
      'a', 'button', '.interactive-card', '.magnetic', 
      '.hero-cta-primary', '.hero-cta-secondary', '.nav-link',
      '.feature-card', '.modern-btn'
    ].join(', '));

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHover(el));
      el.addEventListener('mouseleave', () => this.onLeave(el));
    });

    // Text elements
    const textElements = document.querySelectorAll('h1, h2, h3, p');
    textElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onTextHover());
      el.addEventListener('mouseleave', () => this.onTextLeave());
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.cursorFollower.style.opacity = '1';
    });
  }

  setupMagneticElements() {
    this.magneticElements = document.querySelectorAll('.magnetic, .hero-cta-primary, .modern-btn');
    
    this.magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => this.magneticEffect(e, el));
      el.addEventListener('mouseleave', () => this.resetMagnetic(el));
    });
  }

  magneticEffect(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
    // Enhanced cursor effect for magnetic elements
    this.cursor.classList.add('magnetic-hover');
  }

  resetMagnetic(element) {
    element.style.transform = 'translate(0, 0)';
    this.cursor.classList.remove('magnetic-hover');
  }

  onHover(element) {
    this.isHovering = true;
    this.cursor.classList.add('hover');
    this.cursorFollower.classList.add('hover');
    
    // Special effects for different element types
    if (element.classList.contains('hero-cta-primary')) {
      this.cursor.classList.add('cta-hover');
    }
    
    if (element.tagName === 'A') {
      this.cursor.classList.add('link-hover');
    }
  }

  onLeave(element) {
    this.isHovering = false;
    this.cursor.classList.remove('hover', 'cta-hover', 'link-hover');
    this.cursorFollower.classList.remove('hover');
  }

  onTextHover() {
    this.cursor.classList.add('text-hover');
  }

  onTextLeave() {
    this.cursor.classList.remove('text-hover');
  }

  animate() {
    // Smooth follower animation
    this.followerX += (this.mouseX - this.followerX) * 0.1;
    this.followerY += (this.mouseY - this.followerY) * 0.1;
    
    this.cursorFollower.style.transform = `translate(${this.followerX}px, ${this.followerY}px)`;
    
    requestAnimationFrame(() => this.animate());
  }

  // Utility methods
  hide() {
    this.cursor.style.display = 'none';
    this.cursorFollower.style.display = 'none';
  }

  show() {
    this.cursor.style.display = 'block';
    this.cursorFollower.style.display = 'block';
  }

  destroy() {
    if (this.cursor) this.cursor.remove();
    if (this.cursorFollower) this.cursorFollower.remove();
  }
}

// Initialize cursor on desktop only
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
  document.addEventListener('DOMContentLoaded', () => {
    window.interactiveCursor = new InteractiveCursor();
  });
}

export default InteractiveCursor;