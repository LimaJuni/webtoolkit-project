// Cache Manager - WebToolKit Enhanced
// Handles browser cache management and service worker updates

class CacheManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupCacheClearing();
    this.setupServiceWorkerUpdate();
    this.addCacheStatusIndicator();
  }

  // Setup cache clearing functionality
  setupCacheClearing() {
    // Add cache clear button to navigation if needed
    const nav = document.querySelector('.main-nav');
    if (nav) {
      const cacheButton = document.createElement('button');
      cacheButton.className = 'cache-clear-btn';
      cacheButton.innerHTML = '🔄 Clear Cache';
      cacheButton.title = 'Clear browser cache and reload page';
      cacheButton.addEventListener('click', () => this.clearCache());
      
      // Add to navigation
      const navContainer = nav.querySelector('.nav-container');
      if (navContainer) {
        navContainer.appendChild(cacheButton);
      }
    }

    // Add keyboard shortcut (Ctrl + Shift + C)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.clearCache();
      }
    });
  }

  // Clear browser cache and reload
  async clearCache() {
    try {
      console.log('Clearing cache...');
      
      // Clear service worker cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Service worker cache cleared');
      }

      // Clear localStorage if needed
      if (confirm('Clear all stored data and reload page?')) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Local storage cleared');
        
        // Reload page
        window.location.reload(true);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      alert('Error clearing cache. Please try refreshing the page manually.');
    }
  }

  // Setup service worker update handling
  setupServiceWorkerUpdate() {
    if ('serviceWorker' in navigator) {
      // Check for service worker updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service worker updated, reloading page...');
        window.location.reload();
      });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          this.showUpdateNotification();
        }
      });

      // Register service worker
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            });
          });
        })
        .catch(error => {
          console.error('Service worker registration failed:', error);
        });
    }
  }

  // Show update notification
  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <span>🔄 New version available!</span>
        <button onclick="window.location.reload()">Reload Now</button>
        <button onclick="this.parentElement.parentElement.remove()">Later</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }

  // Add cache status indicator
  addCacheStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'cache-status-indicator';
    indicator.innerHTML = `
      <div class="cache-status">
        <span class="cache-icon">💾</span>
        <span class="cache-text">Cache: Active</span>
      </div>
    `;
    
    // Add to page (you can position this where you want)
    document.body.appendChild(indicator);
    
    // Update cache status
    this.updateCacheStatus(indicator);
  }

  // Update cache status display
  async updateCacheStatus(indicator) {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const totalSize = await this.getCacheSize(cacheNames);
        
        const statusText = indicator.querySelector('.cache-text');
        statusText.textContent = `Cache: ${cacheNames.length} items (${totalSize})`;
        
        // Change color based on cache size
        if (totalSize > '5MB') {
          indicator.classList.add('cache-large');
        } else if (totalSize > '2MB') {
          indicator.classList.add('cache-medium');
        } else {
          indicator.classList.add('cache-small');
        }
      } catch (error) {
        console.error('Error getting cache status:', error);
      }
    }
  }

  // Get total cache size
  async getCacheSize(cacheNames) {
    let totalSize = 0;
    
    for (const cacheName of cacheNames) {
      try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        for (const request of keys) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      } catch (error) {
        console.error('Error calculating cache size:', error);
      }
    }
    
    return this.formatBytes(totalSize);
  }

  // Format bytes to human readable
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Force reload without cache
  forceReload() {
    // Clear cache and reload
    this.clearCache();
    
    // Force reload after a short delay
    setTimeout(() => {
      window.location.reload(true);
    }, 100);
  }
}

// Initialize cache manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cacheManager = new CacheManager();
});

// Export for use in other modules
window.CacheManager = CacheManager; 