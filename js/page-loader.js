// Enhanced Page Loader with Modern Animations

class PageLoader {
  constructor() {
    this.loader = null;
    this.isLoading = false;
    this.loadingQueue = new Set();
    this.init();
  }

  init() {
    this.createLoader();
    this.setupEventListeners();
    this.hideLoader();
  }

  createLoader() {
    // Create loader HTML
    const loaderHTML = `
      <div class="page-loader" id="page-loader">
        <div class="loader-content">
          <div class="loader-spinner"></div>
          <div class="loader-text">Loading...</div>
          <div class="loader-subtext">Please wait while we prepare your experience</div>
        </div>
      </div>
    `;

    // Insert loader into DOM
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    this.loader = document.getElementById('page-loader');
  }

  showLoader(text = 'Loading...', subtext = 'Please wait while we prepare your experience') {
    if (!this.loader) return;

    this.isLoading = true;
    const textElement = this.loader.querySelector('.loader-text');
    const subtextElement = this.loader.querySelector('.loader-subtext');

    if (textElement) textElement.textContent = text;
    if (subtextElement) subtextElement.textContent = subtext;

    this.loader.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hideLoader() {
    if (!this.loader) return;

    this.isLoading = false;
    this.loader.classList.add('hidden');
    document.body.style.overflow = '';

    // Remove loader from DOM after animation
    setTimeout(() => {
      if (this.loader && this.loader.classList.contains('hidden')) {
        this.loader.remove();
        this.loader = null;
      }
    }, 500);
  }

  // Show loader for specific operations
  showForOperation(operationId, text, subtext) {
    this.loadingQueue.add(operationId);
    if (this.loadingQueue.size === 1) {
      this.showLoader(text, subtext);
    }
  }

  // Hide loader for specific operations
  hideForOperation(operationId) {
    this.loadingQueue.delete(operationId);
    if (this.loadingQueue.size === 0) {
      this.hideLoader();
    }
  }

  setupEventListeners() {
    // Show loader on page navigation
    window.addEventListener('beforeunload', () => {
      this.showLoader('Navigating...', 'Taking you to your destination');
    });

    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => this.hideLoader(), 500);
    });

    // Show loader for AJAX requests
    this.interceptFetch();
  }

  interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = (...args) => {
      const requestId = Math.random().toString(36).substr(2, 9);
      this.showForOperation(requestId, 'Loading data...', 'Fetching the latest information');

      return originalFetch(...args)
        .then(response => {
          this.hideForOperation(requestId);
          return response;
        })
        .catch(error => {
          this.hideForOperation(requestId);
          throw error;
        });
    };
  }

  // Utility methods for different loader types
  createSkeletonLoader(container, type = 'card') {
    const skeletons = {
      card: `
        <div class="skeleton skeleton-card"></div>
      `,
      text: `
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text medium"></div>
        <div class="skeleton skeleton-text short"></div>
      `,
      list: `
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text medium"></div>
        <div class="skeleton skeleton-text long"></div>
        <div class="skeleton skeleton-text short"></div>
      `,
      profile: `
        <div style="display: flex; gap: 1rem; align-items: center;">
          <div class="skeleton skeleton-avatar"></div>
          <div style="flex: 1;">
            <div class="skeleton skeleton-text medium"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </div>
      `
    };

    if (container && skeletons[type]) {
      container.innerHTML = skeletons[type];
    }
  }

  removeSkeletonLoader(container, originalContent) {
    if (container) {
      container.innerHTML = originalContent;
    }
  }

  // Create inline loaders
  createInlineLoader(type = 'dots') {
    const loaders = {
      dots: `
        <div class="dots-loader">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      `,
      wave: `
        <div class="wave-loader">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
      `,
      progress: `
        <div class="progress-loader">
          <div class="progress-loader-fill"></div>
        </div>
      `,
      ripple: `
        <div class="ripple-loader">
          <div></div>
          <div></div>
        </div>
      `,
      morphing: `
        <div class="morphing-loader"></div>
      `
    };

    return loaders[type] || loaders.dots;
  }

  // Add loading state to element
  addLoadingState(element, loaderType = 'dots') {
    if (!element) return;

    element.classList.add('loading-state');
    const loader = document.createElement('div');
    loader.className = 'inline-loader';
    loader.innerHTML = this.createInlineLoader(loaderType);
    loader.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    `;
    element.appendChild(loader);
  }

  // Remove loading state from element
  removeLoadingState(element) {
    if (!element) return;

    element.classList.remove('loading-state');
    const loader = element.querySelector('.inline-loader');
    if (loader) {
      loader.remove();
    }
  }

  // Simulate loading with progress
  simulateProgress(callback, duration = 2000) {
    let progress = 0;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        if (callback) callback();
      }
      
      // Update progress if there's a progress element
      const progressElement = document.querySelector('.progress-loader-fill');
      if (progressElement) {
        progressElement.style.width = progress + '%';
      }
    }, interval);

    return timer;
  }
}

// Initialize page loader
document.addEventListener('DOMContentLoaded', () => {
  window.pageLoader = new PageLoader();
});

// Export for use in other modules
export default PageLoader;