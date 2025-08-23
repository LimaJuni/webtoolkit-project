// Enhanced Contact Management System

class ContactManager {
  constructor() {
    this.contacts = this.loadContacts();
    this.filteredContacts = [...this.contacts];
    this.currentSort = 'name';
    this.currentSearch = '';
    
    this.contactsGrid = document.getElementById('contacts-grid');
    this.contactsCount = document.getElementById('contacts-count');
    this.emptyState = document.getElementById('empty-state');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderContacts();
    this.updateUI();
  }

  setupEventListeners() {
    // Listen for UI events
    document.addEventListener('addContact', (e) => {
      this.addContact(e.detail);
    });

    document.addEventListener('updateContact', (e) => {
      this.updateContact(e.detail.id, e.detail);
    });

    document.addEventListener('searchContacts', (e) => {
      this.searchContacts(e.detail.query);
    });

    document.addEventListener('sortContacts', (e) => {
      this.sortContacts(e.detail.sortBy);
    });

    // Contact card interactions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete')) {
        const contactId = e.target.closest('.contact-card').dataset.contactId;
        this.deleteContact(contactId);
      } else if (e.target.classList.contains('edit')) {
        const contactId = e.target.closest('.contact-card').dataset.contactId;
        this.editContact(contactId);
      }
    });

    // Bulk operations
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('contact-checkbox')) {
        this.handleCheckboxChange(e.target);
      }
    });

    document.getElementById('export-all')?.addEventListener('click', () => {
      this.exportContacts();
    });

    document.getElementById('delete-selected')?.addEventListener('click', () => {
      this.deleteSelected();
    });

    document.getElementById('export-selected')?.addEventListener('click', () => {
      this.exportSelected();
    });
  }

  addContact(contactData) {
    const contact = {
      id: this.generateId(),
      name: contactData.name,
      phone: contactData.phone,
      email: contactData.email || '',
      company: contactData.company || '',
      address: contactData.address || '',
      profilePicture: contactData.profilePicture || '',
      dateAdded: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    // Check for duplicates
    if (this.isDuplicate(contact)) {
      this.showError('A contact with this name or phone already exists');
      return false;
    }

    this.contacts.unshift(contact);
    this.saveContacts();
    this.applyFiltersAndSort();
    this.renderContacts();
    this.updateUI();
    
    return true;
  }

  editContact(contactId) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Populate form with contact data
    document.getElementById('contact-name').value = contact.name;
    document.getElementById('contact-phone').value = contact.phone;
    document.getElementById('contact-email').value = contact.email;
    document.getElementById('contact-company').value = contact.company;

    // Change form to edit mode
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.dataset.editingId = contactId;
    submitBtn.textContent = 'Update Contact';
    
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('contact-name').focus();
  }

  updateContact(contactId, contactData) {
    const contactIndex = this.contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) return false;

    const updatedContact = {
      ...this.contacts[contactIndex],
      name: contactData.name,
      phone: contactData.phone,
      email: contactData.email || '',
      company: contactData.company || '',
      lastModified: new Date().toISOString()
    };

    // Check for duplicates (excluding current contact)
    if (this.isDuplicate(updatedContact, contactId)) {
      this.showError('A contact with this name or phone already exists');
      return false;
    }

    this.contacts[contactIndex] = updatedContact;
    this.saveContacts();
    this.applyFiltersAndSort();
    this.renderContacts();
    this.updateUI();

    // Reset form
    const form = document.getElementById('contact-form');
    delete form.dataset.editingId;
    form.querySelector('button[type="submit"]').textContent = 'Add Contact';
    
    return true;
  }

  deleteContact(contactId) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;

    if (confirm(`Delete contact "${contact.name}"?`)) {
      this.contacts = this.contacts.filter(c => c.id !== contactId);
      this.saveContacts();
      this.applyFiltersAndSort();
      this.renderContacts();
      this.updateUI();
      this.showSuccess('Contact deleted successfully');
    }
  }

  searchContacts(query) {
    this.currentSearch = query.toLowerCase().trim();
    this.applyFiltersAndSort();
    this.renderContacts();
    this.updateUI();
  }

  sortContacts(sortBy) {
    this.currentSort = sortBy;
    this.applyFiltersAndSort();
    this.renderContacts();
  }

  applyFiltersAndSort() {
    // Apply search filter
    this.filteredContacts = this.contacts.filter(contact => {
      if (!this.currentSearch) return true;
      
      const searchFields = [
        contact.name,
        contact.phone,
        contact.email,
        contact.company
      ].join(' ').toLowerCase();
      
      return searchFields.includes(this.currentSearch);
    });

    // Apply sorting
    this.filteredContacts.sort((a, b) => {
      switch (this.currentSort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        default:
          return 0;
      }
    });
  }

  renderContacts() {
    if (!this.contactsGrid) return;

    if (this.filteredContacts.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    
    this.contactsGrid.innerHTML = this.filteredContacts
      .map(contact => this.renderContactCard(contact))
      .join('');
  }

  renderContactCard(contact) {
    const initials = this.getInitials(contact.name);
    const highlightedName = this.highlightSearchTerm(contact.name);
    const highlightedCompany = this.highlightSearchTerm(contact.company);
    const highlightedPhone = this.highlightSearchTerm(contact.phone);
    const highlightedEmail = this.highlightSearchTerm(contact.email);
    
    return `
      <div class="contact-card" data-contact-id="${contact.id}">
        <input type="checkbox" class="contact-checkbox" data-contact-id="${contact.id}">
        <div class="contact-header">
          <div class="contact-avatar">${initials}</div>
          <div class="contact-info">
            <div class="contact-name">${highlightedName}</div>
            ${contact.company ? `<div class="contact-company">${highlightedCompany}</div>` : ''}
          </div>
        </div>
        <div class="contact-details">
          <div class="contact-detail">
            <span class="contact-detail-icon">📞</span>
            <span>${highlightedPhone}</span>
          </div>
          ${contact.email ? `
            <div class="contact-detail">
              <span class="contact-detail-icon">✉️</span>
              <span>${highlightedEmail}</span>
            </div>
          ` : ''}
          ${contact.address ? `
            <div class="contact-detail">
              <span class="contact-detail-icon">📍</span>
              <span>${this.escapeHtml(contact.address)}</span>
            </div>
          ` : ''}
        </div>
        <div class="contact-actions">
          <button class="contact-action-btn edit" aria-label="Edit ${contact.name}" title="Edit">✏️</button>
          <button class="contact-action-btn delete" aria-label="Delete ${contact.name}" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }

  highlightSearchTerm(text) {
    if (!text || !this.currentSearch) {
      return this.escapeHtml(text);
    }

    const escapedText = this.escapeHtml(text);
    const escapedSearch = this.escapeHtml(this.currentSearch);
    const regex = new RegExp(`(${escapedSearch})`, 'gi');
    
    return escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  updateUI() {
    // Update contacts count
    if (this.contactsCount) {
      const count = this.filteredContacts.length;
      this.contactsCount.textContent = `${count} contact${count !== 1 ? 's' : ''}`;
    }

    // Show/hide empty state
    if (this.filteredContacts.length === 0) {
      this.showEmptyState();
    } else {
      this.hideEmptyState();
    }
  }

  showEmptyState() {
    if (this.emptyState) {
      if (this.currentSearch) {
        this.emptyState.innerHTML = `
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">No contacts found</h3>
          <p class="empty-description">Try adjusting your search terms</p>
        `;
      } else {
        this.emptyState.innerHTML = `
          <div class="empty-icon">📞</div>
          <h3 class="empty-title">No contacts yet</h3>
          <p class="empty-description">Add your first contact using the form above</p>
        `;
      }
      this.emptyState.style.display = 'block';
    }
    if (this.contactsGrid) {
      this.contactsGrid.style.display = 'none';
    }
  }

  hideEmptyState() {
    if (this.emptyState) {
      this.emptyState.style.display = 'none';
    }
    if (this.contactsGrid) {
      this.contactsGrid.style.display = 'grid';
    }
  }

  isDuplicate(contact, excludeId = null) {
    return this.contacts.some(existing => {
      if (excludeId && existing.id === excludeId) return false;
      return existing.name.toLowerCase() === contact.name.toLowerCase() ||
             existing.phone === contact.phone;
    });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getInitials(name) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  loadContacts() {
    try {
      const saved = localStorage.getItem('phonebook-contacts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to load contacts:', error);
      return [];
    }
  }

  saveContacts() {
    try {
      localStorage.setItem('phonebook-contacts', JSON.stringify(this.contacts));
    } catch (error) {
      console.warn('Failed to save contacts:', error);
      this.showError('Failed to save contacts');
    }
  }

  showSuccess(message) {
    this.showToast(message, 'success');
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      background: ${type === 'success' ? 'var(--color-green-500)' : 'var(--color-red-500)'};
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Export contacts as JSON
  exportContacts() {
    const dataStr = JSON.stringify(this.contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  handleCheckboxChange(checkbox) {
    const card = checkbox.closest('.contact-card');
    if (checkbox.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
    this.updateBulkActions();
  }

  updateBulkActions() {
    const selected = document.querySelectorAll('.contact-checkbox:checked');
    const bulkActions = document.getElementById('bulk-actions');
    if (selected.length > 0) {
      bulkActions.style.display = 'flex';
    } else {
      bulkActions.style.display = 'none';
    }
  }

  deleteSelected() {
    const selected = document.querySelectorAll('.contact-checkbox:checked');
    if (selected.length === 0) return;
    
    if (confirm(`Delete ${selected.length} selected contacts?`)) {
      const idsToDelete = Array.from(selected).map(cb => cb.dataset.contactId);
      this.contacts = this.contacts.filter(c => !idsToDelete.includes(c.id));
      this.saveContacts();
      this.applyFiltersAndSort();
      this.renderContacts();
      this.updateUI();
      this.showSuccess(`${selected.length} contacts deleted`);
    }
  }

  exportSelected() {
    const selected = document.querySelectorAll('.contact-checkbox:checked');
    if (selected.length === 0) return;
    
    const idsToExport = Array.from(selected).map(cb => cb.dataset.contactId);
    const contactsToExport = this.contacts.filter(c => idsToExport.includes(c.id));
    
    const dataStr = JSON.stringify(contactsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `selected-contacts-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.showSuccess(`${selected.length} contacts exported`);
  }

  // Get contact statistics
  getStats() {
    return {
      total: this.contacts.length,
      withEmail: this.contacts.filter(c => c.email).length,
      withCompany: this.contacts.filter(c => c.company).length,
      recentlyAdded: this.contacts.filter(c => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(c.dateAdded) > weekAgo;
      }).length
    };
  }
}

// Initialize contact manager
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.contact-form')) {
    window.contactManager = new ContactManager();
  }
});

export default ContactManager;