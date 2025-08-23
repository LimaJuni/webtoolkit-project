// Phonebook UI - Interface Interactions

class PhonebookUI {
  constructor() {
    this.contactForm = document.getElementById('contact-form');
    this.searchInput = document.getElementById('contact-search');
    this.sortSelect = document.getElementById('sort-select');
    this.viewToggle = document.getElementById('view-toggle');
    this.contactsGrid = document.getElementById('contacts-grid');
    this.contactsCount = document.getElementById('contacts-count');
    this.emptyState = document.getElementById('empty-state');
    
    if (!this.contactForm) return;
    
    this.isListView = false;
    this.init();
  }

  init() {
    this.setupFormInteractions();
    this.setupSearchAndFilter();
    this.setupViewToggle();
    this.setupFormValidation();
  }

  setupFormInteractions() {
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    this.contactForm.addEventListener('reset', () => {
      this.clearFormErrors();
    });

    // Real-time validation
    const inputs = this.contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  setupSearchAndFilter() {
    this.searchInput?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.sortSelect?.addEventListener('change', (e) => {
      this.handleSort(e.target.value);
    });

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    searchBtn?.addEventListener('click', () => {
      this.searchInput.focus();
    });
  }

  setupViewToggle() {
    this.viewToggle?.addEventListener('click', () => {
      this.toggleView();
    });
  }

  setupFormValidation() {
    // Phone number formatting
    const phoneInput = document.getElementById('contact-phone');
    phoneInput?.addEventListener('input', (e) => {
      this.formatPhoneNumber(e.target);
    });
  }

  handleFormSubmit() {
    const formData = new FormData(this.contactForm);
    const contactData = {
      name: formData.get('name').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      company: formData.get('company').trim()
    };

    if (this.validateForm(contactData)) {
      const editingId = this.contactForm.dataset.editingId;
      
      if (editingId) {
        // Update existing contact
        document.dispatchEvent(new CustomEvent('updateContact', {
          detail: { id: editingId, ...contactData }
        }));
      } else {
        // Add new contact
        document.dispatchEvent(new CustomEvent('addContact', {
          detail: contactData
        }));
      }
      
      this.contactForm.reset();
      this.clearFormErrors();
      
      // Reset form state
      delete this.contactForm.dataset.editingId;
      this.contactForm.querySelector('button[type="submit"]').textContent = 'Add Contact';
    }
  }

  validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name) {
      this.showFieldError('contact-name', 'Name is required');
      isValid = false;
    }
    
    // Phone validation
    if (!data.phone) {
      this.showFieldError('contact-phone', 'Phone number is required');
      isValid = false;
    } else if (!this.isValidPhone(data.phone)) {
      this.showFieldError('contact-phone', 'Please enter a valid phone number');
      isValid = false;
    }
    
    // Email validation (optional but must be valid if provided)
    if (data.email && !this.isValidEmail(data.email)) {
      this.showFieldError('contact-email', 'Please enter a valid email address');
      isValid = false;
    }
    
    return isValid;
  }

  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    
    switch (fieldName) {
      case 'name':
        if (!value) {
          this.showFieldError(input.id, 'Name is required');
          return false;
        }
        break;
      case 'phone':
        if (!value) {
          this.showFieldError(input.id, 'Phone number is required');
          return false;
        } else if (!this.isValidPhone(value)) {
          this.showFieldError(input.id, 'Please enter a valid phone number');
          return false;
        }
        break;
      case 'email':
        if (value && !this.isValidEmail(value)) {
          this.showFieldError(input.id, 'Please enter a valid email address');
          return false;
        }
        break;
    }
    
    this.clearFieldError(input);
    return true;
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId.replace('contact-', '') + '-error');
    
    if (field && errorElement) {
      field.classList.add('error');
      errorElement.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    }
  }

  clearFieldError(input) {
    const errorElement = document.getElementById(input.name + '-error');
    
    if (errorElement) {
      input.classList.remove('error');
      errorElement.textContent = '';
      input.setAttribute('aria-invalid', 'false');
    }
  }

  clearFormErrors() {
    const errorElements = this.contactForm.querySelectorAll('.form-error');
    const inputElements = this.contactForm.querySelectorAll('.form-input');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => {
      el.classList.remove('error');
      el.setAttribute('aria-invalid', 'false');
    });
  }

  formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    }
    
    input.value = value;
  }

  isValidPhone(phone) {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  handleSearch(query) {
    document.dispatchEvent(new CustomEvent('searchContacts', {
      detail: { query }
    }));
  }

  handleSort(sortBy) {
    document.dispatchEvent(new CustomEvent('sortContacts', {
      detail: { sortBy }
    }));
  }

  toggleView() {
    this.isListView = !this.isListView;
    
    if (this.isListView) {
      this.contactsGrid.classList.add('list-view');
      this.viewToggle.querySelector('.view-icon').textContent = '⊞';
      this.viewToggle.setAttribute('title', 'Switch to grid view');
    } else {
      this.contactsGrid.classList.remove('list-view');
      this.viewToggle.querySelector('.view-icon').textContent = '📋';
      this.viewToggle.setAttribute('title', 'Switch to list view');
    }
  }

  updateContactsCount(count) {
    if (this.contactsCount) {
      this.contactsCount.textContent = `${count} contact${count !== 1 ? 's' : ''}`;
    }
  }

  showEmptyState(show = true) {
    if (this.emptyState) {
      this.emptyState.style.display = show ? 'block' : 'none';
    }
    if (this.contactsGrid) {
      this.contactsGrid.style.display = show ? 'none' : 'grid';
    }
  }

  renderContact(contact) {
    const initials = this.getInitials(contact.name);
    
    return `
      <div class="contact-card" data-contact-id="${contact.id}">
        <div class="contact-header">
          <div class="contact-avatar">${initials}</div>
          <div class="contact-info">
            <div class="contact-name">${this.escapeHtml(contact.name)}</div>
            ${contact.company ? `<div class="contact-company">${this.escapeHtml(contact.company)}</div>` : ''}
          </div>
        </div>
        <div class="contact-details">
          <div class="contact-detail">
            <span class="contact-detail-icon">📞</span>
            <span>${this.escapeHtml(contact.phone)}</span>
          </div>
          ${contact.email ? `
            <div class="contact-detail">
              <span class="contact-detail-icon">✉️</span>
              <span>${this.escapeHtml(contact.email)}</span>
            </div>
          ` : ''}
        </div>
        <div class="contact-actions">
          <button class="contact-action-btn edit" aria-label="Edit contact" title="Edit">✏️</button>
          <button class="contact-action-btn delete" aria-label="Delete contact" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }

  getInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-green-500);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize phonebook UI
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.contact-form')) {
    new PhonebookUI();
  }
});

export default PhonebookUI;