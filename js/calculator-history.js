// Calculator History and Advanced Features

class CalculatorHistory {
  constructor() {
    this.historyPanel = document.getElementById('history-panel');
    this.historyToggle = document.getElementById('history-toggle');
    this.historyList = document.getElementById('history-list');
    this.historyEmpty = document.getElementById('history-empty');
    this.historyClear = document.getElementById('history-clear');
    this.copyBtn = document.getElementById('copy-result');
    this.display = document.getElementById('calc-display');
    
    if (!this.historyPanel) return;
    
    this.history = this.loadHistory();
    this.isCollapsed = localStorage.getItem('calc-history-collapsed') === 'true';
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateHistoryDisplay();
    this.setCollapsedState(this.isCollapsed);
  }

  setupEventListeners() {
    // History toggle
    this.historyToggle?.addEventListener('click', () => {
      this.toggleHistory();
    });

    // Clear history
    this.historyClear?.addEventListener('click', () => {
      this.clearHistory();
    });

    // Copy to clipboard
    this.copyBtn?.addEventListener('click', () => {
      this.copyResult();
    });

    // Listen for calculator events
    document.addEventListener('calculationComplete', (e) => {
      this.addToHistory(e.detail);
    });
  }

  toggleHistory() {
    this.isCollapsed = !this.isCollapsed;
    this.setCollapsedState(this.isCollapsed);
    localStorage.setItem('calc-history-collapsed', this.isCollapsed.toString());
  }

  setCollapsedState(collapsed) {
    if (collapsed) {
      this.historyPanel.classList.add('collapsed');
    } else {
      this.historyPanel.classList.remove('collapsed');
    }
  }

  addToHistory(calculation) {
    const historyItem = {
      id: Date.now(),
      expression: calculation.expression,
      result: calculation.result,
      timestamp: new Date().toISOString()
    };

    this.history.unshift(historyItem);
    
    // Keep only last 50 calculations
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }

    this.saveHistory();
    this.updateHistoryDisplay();
  }

  updateHistoryDisplay() {
    if (!this.historyList) return;

    if (this.history.length === 0) {
      this.historyEmpty.style.display = 'block';
      this.historyList.innerHTML = '';
      return;
    }

    this.historyEmpty.style.display = 'none';
    
    this.historyList.innerHTML = this.history.map(item => `
      <div class="history-item" data-result="${item.result}" data-expression="${item.expression}">
        <div class="history-expression">${item.expression}</div>
        <div class="history-result">${item.result}</div>
      </div>
    `).join('');

    // Add click listeners to history items
    this.historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const result = item.dataset.result;
        this.useHistoryResult(result);
      });
    });
  }

  useHistoryResult(result) {
    // Dispatch event to update calculator display
    document.dispatchEvent(new CustomEvent('useHistoryResult', {
      detail: { result }
    }));
  }

  clearHistory() {
    if (confirm('Clear all calculation history?')) {
      this.history = [];
      this.saveHistory();
      this.updateHistoryDisplay();
      this.announceToScreenReader('History cleared');
    }
  }

  async copyResult() {
    const result = this.display?.textContent || '0';
    
    try {
      await navigator.clipboard.writeText(result);
      this.showCopyFeedback(true);
      this.announceToScreenReader(`Copied ${result} to clipboard`);
    } catch (err) {
      // Fallback for older browsers
      this.fallbackCopy(result);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback(true);
      this.announceToScreenReader(`Copied ${text} to clipboard`);
    } catch (err) {
      this.showCopyFeedback(false);
      this.announceToScreenReader('Failed to copy to clipboard');
    }
    
    document.body.removeChild(textArea);
  }

  showCopyFeedback(success) {
    if (!this.copyBtn) return;

    const originalIcon = this.copyBtn.querySelector('.copy-icon').textContent;
    const icon = this.copyBtn.querySelector('.copy-icon');
    
    if (success) {
      this.copyBtn.classList.add('copied');
      icon.textContent = '✓';
    } else {
      this.copyBtn.style.background = 'var(--color-red-500)';
      icon.textContent = '✗';
    }

    setTimeout(() => {
      this.copyBtn.classList.remove('copied');
      this.copyBtn.style.background = '';
      icon.textContent = originalIcon;
    }, 1500);
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem('calculator-history');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn('Failed to load calculator history:', err);
      return [];
    }
  }

  saveHistory() {
    try {
      localStorage.setItem('calculator-history', JSON.stringify(this.history));
    } catch (err) {
      console.warn('Failed to save calculator history:', err);
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }

  // Export history as JSON
  exportHistory() {
    const dataStr = JSON.stringify(this.history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Import history from JSON
  importHistory(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          this.history = [...imported, ...this.history].slice(0, 50);
          this.saveHistory();
          this.updateHistoryDisplay();
          this.announceToScreenReader('History imported successfully');
        }
      } catch (err) {
        this.announceToScreenReader('Failed to import history');
      }
    };
    reader.readAsText(file);
  }
}

// Initialize calculator history
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.calculator')) {
    new CalculatorHistory();
  }
});

export default CalculatorHistory;