// Theme Manager - Cross-page state management

class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
    this.setupEventListeners();
  }

  createThemeToggle() {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;

    const themeToggle = document.createElement('li');
    themeToggle.className = 'nav-item';
    themeToggle.innerHTML = `
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
        <span class="theme-icon">${this.currentTheme === 'dark' ? '☀️' : '🌙'}</span>
      </button>
    `;
    nav.appendChild(themeToggle);
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    this.saveTheme();
    this.updateToggleIcon();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  updateToggleIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }

  saveTheme() {
    localStorage.setItem('theme', this.currentTheme);
  }
}

// Initialize theme manager
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});

export default ThemeManager;