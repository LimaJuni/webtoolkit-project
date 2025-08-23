// App Polish - Loading states and error handling

class AppPolish {
  constructor() {
    this.init();
  }

  init() {
    this.addLoadingStates();
    this.setupGlobalErrorHandling();
    this.addFormValidation();
    this.optimizePerformance();
  }

  addLoadingStates() {
    // Add loading spinner CSS
    const style = document.createElement('style');
    style.textContent = `
      .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid var(--color-primary-500);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .btn-loading {
        pointer-events: none;
        opacity: 0.7;
      }
    `;
    document.head.appendChild(style);

    // Add loading to form submissions
    document.addEventListener('submit', (e) => {
      const submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) {
        this.showButtonLoading(submitBtn);
        setTimeout(() => this.hideButtonLoading(submitBtn), 1000);
      }
    });
  }

  showButtonLoading(button) {
    const originalText = button.textContent;
    button.dataset.originalText = originalText;
    button.innerHTML = '<span class="loading-spinner"></span> Loading...';
    button.classList.add('btn-loading');
  }

  hideButtonLoading(button) {
    const originalText = button.dataset.originalText || 'Submit';
    button.textContent = originalText;
    button.classList.remove('btn-loading');
  }

  setupGlobalErrorHandling() {
    // Handle JavaScript errors
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      this.showErrorToast('Something went wrong. Please try again.');
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showErrorToast('An error occurred. Please refresh the page.');
    });

    // Handle network errors
    window.addEventListener('offline', () => {
      this.showErrorToast('You are offline. Some features may not work.');
    });

    window.addEventListener('online', () => {
      this.showSuccessToast('Connection restored!');
    });
  }

  addFormValidation() {
    // Enhanced form validation
    document.addEventListener('input', (e) => {
      if (e.target.matches('input[type="email"]')) {
        this.validateEmail(e.target);
      } else if (e.target.matches('input[type="tel"]')) {
        this.validatePhone(e.target);
      } else if (e.target.matches('input[required]')) {
        this.validateRequired(e.target);
      }
    });
  }

  validateEmail(input) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
    this.setFieldValidation(input, isValid, 'Please enter a valid email address');
  }

  validatePhone(input) {
    const isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(input.value);
    this.setFieldValidation(input, isValid, 'Please enter a valid phone number');
  }

  validateRequired(input) {
    const isValid = input.value.trim().length > 0;
    this.setFieldValidation(input, isValid, 'This field is required');
  }

  setFieldValidation(input, isValid, errorMessage) {
    const errorElement = input.parentNode.querySelector('.form-error');
    
    if (isValid) {
      input.classList.remove('error');
      if (errorElement) errorElement.textContent = '';
    } else if (input.value) {
      input.classList.add('error');
      if (errorElement) errorElement.textContent = errorMessage;
    }
  }

  optimizePerformance() {
    // Lazy load images
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

    // Debounce search inputs
    document.addEventListener('input', this.debounce((e) => {
      if (e.target.matches('.search-input')) {
        // Search is already handled by existing code
      }
    }, 300));
  }

  debounce(func, wait) {
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

  showErrorToast(message) {
    this.showToast(message, 'error');
  }

  showSuccessToast(message) {
    this.showToast(message, 'success');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      z-index: 1000;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
      background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#3742fa'};
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Add toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(toastStyle);

// Initialize app polish
document.addEventListener('DOMContentLoaded', () => {
  new AppPolish();
});

export default AppPolish;