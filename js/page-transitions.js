// Smooth Page Transitions - Modern Agency Style

class PageTransitions {
  constructor() {
    this.isTransitioning = false;
    this.transitionDuration = 800;
    this.init();
  }

  init() {
    this.createTransitionOverlay();
    this.setupPageLinks();
    this.setupBackButton();
    this.preloadPages();
  }

  createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.innerHTML = `
      <div class="transition-content">
        <div class="transition-loader">
          <div class="loader-bar"></div>
          <div class="loader-text">Loading...</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  setupPageLinks() {
    // Handle internal page links
    const pageLinks = document.querySelectorAll('a[href$=".html"], a[href^="./"], a[href^="/"]');
    
    pageLinks.forEach(link => {
      // Skip external links and anchors
      if (link.hostname !== window.location.hostname || 
          link.getAttribute('href').startsWith('#') ||
          link.hasAttribute('target')) {
        return;
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToPage(link.href);
      });
    });
  }

  setupBackButton() {
    window.addEventListener('popstate', (e) => {
      if (!this.isTransitioning) {
        this.navigateToPage(window.location.href, false);
      }
    });
  }

  async navigateToPage(url, pushState = true) {
    if (this.isTransitioning || url === window.location.href) return;
    
    this.isTransitioning = true;
    
    try {
      // Start transition animation
      await this.startTransition();
      
      // Fetch new page content
      const newContent = await this.fetchPage(url);
      
      // Update page content
      this.updatePageContent(newContent);
      
      // Update browser history
      if (pushState) {
        history.pushState(null, '', url);
      }
      
      // End transition animation
      await this.endTransition();
      
      // Reinitialize components
      this.reinitializeComponents();
      
    } catch (error) {
      console.error('Page transition failed:', error);
      // Fallback to normal navigation
      window.location.href = url;
    } finally {
      this.isTransitioning = false;
    }
  }

  startTransition() {
    return new Promise(resolve => {
      this.overlay.classList.add('active');
      
      // Animate current content out
      document.body.classList.add('page-transitioning');
      
      setTimeout(resolve, this.transitionDuration / 2);
    });
  }

  endTransition() {
    return new Promise(resolve => {
      // Animate new content in
      setTimeout(() => {
        this.overlay.classList.remove('active');
        document.body.classList.remove('page-transitioning');
        resolve();
      }, this.transitionDuration / 2);
    });
  }

  async fetchPage(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const html = await response.text();
    const parser = new DOMParser();
    return parser.parseFromString(html, 'text/html');
  }

  updatePageContent(newDoc) {
    // Update title
    document.title = newDoc.title;
    
    // Update main content
    const newMain = newDoc.querySelector('main');
    const currentMain = document.querySelector('main');
    if (newMain && currentMain) {
      currentMain.innerHTML = newMain.innerHTML;
    }
    
    // Update navigation active states
    this.updateNavigation();
    
    // Update meta tags
    this.updateMetaTags(newDoc);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }

  updateNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPage || 
          (currentPage === '' && linkPath === 'index.html') ||
          (currentPage === 'index.html' && linkPath === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  updateMetaTags(newDoc) {
    // Update meta description
    const newDescription = newDoc.querySelector('meta[name="description"]');
    const currentDescription = document.querySelector('meta[name="description"]');
    if (newDescription && currentDescription) {
      currentDescription.setAttribute('content', newDescription.getAttribute('content'));
    }
    
    // Update other meta tags as needed
    const metaTags = ['keywords', 'author', 'robots'];
    metaTags.forEach(name => {
      const newMeta = newDoc.querySelector(`meta[name="${name}"]`);
      const currentMeta = document.querySelector(`meta[name="${name}"]`);
      if (newMeta && currentMeta) {
        currentMeta.setAttribute('content', newMeta.getAttribute('content'));
      }
    });
  }

  reinitializeComponents() {
    // Reinitialize scroll animations
    if (window.scrollAnimations) {
      window.scrollAnimations.init();
    }
    
    // Reinitialize interactive cursor
    if (window.interactiveCursor) {
      window.interactiveCursor.setupEventListeners();
      window.interactiveCursor.setupMagneticElements();
    }
    
    // Reinitialize other components
    if (window.ModernInteractions) {
      new window.ModernInteractions();
    }
    
    // Trigger custom event for other scripts
    document.dispatchEvent(new CustomEvent('pageTransitionComplete'));
  }

  preloadPages() {
    // Preload critical pages on hover
    const criticalLinks = document.querySelectorAll('.nav-link, .hero-cta-primary');
    
    criticalLinks.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html')) {
          this.preloadPage(href);
        }
      });
    });
  }

  preloadPage(url) {
    // Create invisible link for preloading
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'prefetch';
    preloadLink.href = url;
    document.head.appendChild(preloadLink);
  }

  // Utility: Add custom transition effect
  addCustomTransition(name, startFn, endFn) {
    this.customTransitions = this.customTransitions || {};
    this.customTransitions[name] = { start: startFn, end: endFn };
  }

  // Utility: Set transition duration
  setTransitionDuration(duration) {
    this.transitionDuration = duration;
  }
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
  window.pageTransitions = new PageTransitions();
});

export default PageTransitions;