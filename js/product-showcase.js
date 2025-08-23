// Modern Product Showcase - E-commerce Style

class ProductShowcase {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentFilter = 'all';
    this.currentSort = 'name';
    this.isGridView = true;
    this.init();
  }

  init() {
    this.loadProducts();
    this.createShowcaseHTML();
    this.setupFilters();
    this.setupSorting();
    this.setupViewToggle();
    this.setupSearch();
    this.setupInfiniteScroll();
  }

  loadProducts() {
    // Sample products data - replace with your actual data
    this.products = [
      {
        id: 1,
        name: 'Advanced Calculator Pro',
        category: 'tools',
        price: 29.99,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
        description: 'Professional calculator with advanced functions and history tracking.',
        features: ['Scientific Functions', 'History Tracking', 'Keyboard Support'],
        inStock: true
      },
      {
        id: 2,
        name: 'Smart Phonebook Manager',
        category: 'productivity',
        price: 19.99,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        description: 'Organize and manage your contacts with smart search and categorization.',
        features: ['Smart Search', 'Categories', 'Export Options'],
        inStock: true
      },
      {
        id: 3,
        name: 'Gallery Pro Suite',
        category: 'media',
        price: 39.99,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
        description: 'Professional image gallery with advanced editing and organization tools.',
        features: ['Drag & Drop', 'Image Editing', 'Cloud Sync'],
        inStock: false
      },
      {
        id: 4,
        name: 'WebToolKit Bundle',
        category: 'bundles',
        price: 79.99,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        description: 'Complete toolkit with all premium features and lifetime updates.',
        features: ['All Tools', 'Premium Support', 'Lifetime Updates'],
        inStock: true
      }
    ];
    
    this.filteredProducts = [...this.products];
  }

  createShowcaseHTML() {
    const showcaseContainer = document.createElement('section');
    showcaseContainer.className = 'product-showcase';
    showcaseContainer.innerHTML = `
      <div class="container">
        <div class="showcase-header">
          <h2 class="showcase-title scroll-reveal">Our Products</h2>
          <p class="showcase-subtitle scroll-reveal">Discover our range of professional web tools</p>
        </div>
        
        <div class="showcase-controls scroll-reveal">
          <div class="controls-left">
            <div class="search-container">
              <input type="text" class="search-input" placeholder="Search products...">
              <span class="search-icon">🔍</span>
            </div>
            
            <div class="filter-container">
              <select class="filter-select">
                <option value="all">All Categories</option>
                <option value="tools">Tools</option>
                <option value="productivity">Productivity</option>
                <option value="media">Media</option>
                <option value="bundles">Bundles</option>
              </select>
            </div>
            
            <div class="sort-container">
              <select class="sort-select">
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
          
          <div class="controls-right">
            <div class="view-toggle">
              <button class="view-btn grid-view active" data-view="grid">⊞</button>
              <button class="view-btn list-view" data-view="list">☰</button>
            </div>
          </div>
        </div>
        
        <div class="products-container">
          <div class="products-grid" id="products-grid"></div>
        </div>
        
        <div class="load-more-container">
          <button class="load-more-btn modern-btn">Load More Products</button>
        </div>
      </div>
    `;
    
    // Insert after hero section or at the end of main content
    const main = document.querySelector('main');
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.insertAdjacentElement('afterend', showcaseContainer);
    } else {
      main.appendChild(showcaseContainer);
    }
    
    this.renderProducts();
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    this.filteredProducts.forEach((product, index) => {
      const productCard = this.createProductCard(product, index);
      grid.appendChild(productCard);
    });
    
    // Trigger scroll animations
    if (window.scrollAnimations) {
      window.scrollAnimations.setupScrollReveal();
    }
  }

  createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = `product-card scroll-reveal-stagger ${!product.inStock ? 'out-of-stock' : ''}`;
    card.style.transitionDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-overlay">
          <button class="quick-view-btn">Quick View</button>
          <button class="add-to-cart-btn ${!product.inStock ? 'disabled' : ''}" 
                  ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        ${!product.inStock ? '<div class="stock-badge">Out of Stock</div>' : ''}
      </div>
      
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        
        <div class="product-features">
          ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
        
        <div class="product-rating">
          <div class="stars">
            ${this.generateStars(product.rating)}
          </div>
          <span class="rating-text">${product.rating}</span>
        </div>
        
        <div class="product-price">
          <span class="price">$${product.price}</span>
        </div>
      </div>
    `;
    
    // Add event listeners
    this.setupProductCardEvents(card, product);
    
    return card;
  }

  setupProductCardEvents(card, product) {
    const quickViewBtn = card.querySelector('.quick-view-btn');
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    
    quickViewBtn.addEventListener('click', () => this.showQuickView(product));
    
    if (product.inStock) {
      addToCartBtn.addEventListener('click', () => this.addToCart(product));
    }
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
      card.classList.add('hovered');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hovered');
    });
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    
    if (hasHalfStar) {
      stars += '☆';
    }
    
    return stars;
  }

  setupFilters() {
    const filterSelect = document.querySelector('.filter-select');
    filterSelect.addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.applyFilters();
    });
  }

  setupSorting() {
    const sortSelect = document.querySelector('.sort-select');
    sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.applySorting();
    });
  }

  setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = document.getElementById('products-grid');
    
    viewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        this.isGridView = view === 'grid';
        
        grid.className = `products-${view}`;
      });
    });
  }

  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchProducts(e.target.value);
      }, 300);
    });
  }

  setupInfiniteScroll() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    loadMoreBtn.addEventListener('click', () => {
      this.loadMoreProducts();
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      return this.currentFilter === 'all' || product.category === this.currentFilter;
    });
    
    this.applySorting();
  }

  applySorting() {
    this.filteredProducts.sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    this.renderProducts();
  }

  searchProducts(query) {
    if (!query.trim()) {
      this.applyFilters();
      return;
    }
    
    this.filteredProducts = this.products.filter(product => {
      const matchesFilter = this.currentFilter === 'all' || product.category === this.currentFilter;
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase()) ||
                           product.description.toLowerCase().includes(query.toLowerCase()) ||
                           product.features.some(feature => feature.toLowerCase().includes(query.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
    
    this.applySorting();
  }

  showQuickView(product) {
    // Create modal for quick view
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close">×</button>
        <div class="quick-view-content">
          <div class="quick-view-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="quick-view-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="quick-view-features">
              ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
            </div>
            <div class="quick-view-rating">
              <div class="stars">${this.generateStars(product.rating)}</div>
              <span>${product.rating}</span>
            </div>
            <div class="quick-view-price">$${product.price}</div>
            <button class="add-to-cart-btn modern-btn ${!product.inStock ? 'disabled' : ''}" 
                    ${!product.inStock ? 'disabled' : ''}>
              ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    
    const closeModal = () => {
      modal.classList.add('closing');
      setTimeout(() => modal.remove(), 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    if (product.inStock) {
      addToCartBtn.addEventListener('click', () => {
        this.addToCart(product);
        closeModal();
      });
    }
    
    // Show modal
    setTimeout(() => modal.classList.add('active'), 10);
  }

  addToCart(product) {
    // Simulate add to cart
    console.log('Added to cart:', product);
    
    // Show success message
    this.showNotification(`${product.name} added to cart!`, 'success');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  loadMoreProducts() {
    // Simulate loading more products
    this.showNotification('Loading more products...', 'info');
    
    setTimeout(() => {
      this.showNotification('All products loaded!', 'success');
    }, 1000);
  }
}

// Initialize product showcase
document.addEventListener('DOMContentLoaded', () => {
  window.productShowcase = new ProductShowcase();
});

export default ProductShowcase;