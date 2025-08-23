// Calculator UI - Visual Feedback and Interactions

class CalculatorUI {
  constructor() {
    this.calculator = document.querySelector('.calculator');
    this.display = document.getElementById('calc-display');
    this.history = document.getElementById('calc-history');
    this.buttons = document.querySelectorAll('.calc-btn');
    
    if (!this.calculator) return;
    
    this.init();
  }

  init() {
    this.setupButtonInteractions();
    this.setupKeyboardSupport();
    this.setupTouchFeedback();
    this.setupAccessibility();
  }

  setupButtonInteractions() {
    this.buttons.forEach(button => {
      // Visual feedback on click
      button.addEventListener('click', (e) => {
        this.animateButtonPress(e.target);
        this.playClickFeedback(e.target);
      });

      // Hover effects
      button.addEventListener('mouseenter', (e) => {
        this.addHoverEffect(e.target);
      });

      button.addEventListener('mouseleave', (e) => {
        this.removeHoverEffect(e.target);
      });
    });
  }

  setupKeyboardSupport() {
    // Map keyboard keys to calculator buttons
    const keyMap = {
      '0': '[data-number="0"]',
      '1': '[data-number="1"]',
      '2': '[data-number="2"]',
      '3': '[data-number="3"]',
      '4': '[data-number="4"]',
      '5': '[data-number="5"]',
      '6': '[data-number="6"]',
      '7': '[data-number="7"]',
      '8': '[data-number="8"]',
      '9': '[data-number="9"]',
      '+': '[data-operation="+"]',
      '-': '[data-operation="-"]',
      '*': '[data-operation="*"]',
      '/': '[data-operation="/"]',
      '=': '[data-action="equals"]',
      'Enter': '[data-action="equals"]',
      '.': '[data-action="decimal"]',
      'Escape': '[data-action="clear"]',
      'Backspace': '[data-action="backspace"]',
      'Delete': '[data-action="clear-entry"]'
    };

    document.addEventListener('keydown', (e) => {
      if (!this.calculator.contains(document.activeElement) && 
          !this.calculator.matches(':focus-within')) {
        return;
      }

      const selector = keyMap[e.key];
      if (selector) {
        e.preventDefault();
        const button = this.calculator.querySelector(selector);
        if (button) {
          this.animateButtonPress(button);
          this.playClickFeedback(button);
          button.click();
        }
      }
    });

    // Add keyboard hints
    Object.entries(keyMap).forEach(([key, selector]) => {
      const button = this.calculator.querySelector(selector);
      if (button && key.length === 1) {
        button.setAttribute('data-key', key.toUpperCase());
      }
    });
  }

  setupTouchFeedback() {
    this.buttons.forEach(button => {
      button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.animateButtonPress(e.target);
        this.addTouchFeedback(e.target);
      }, { passive: false });

      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.removeTouchFeedback(e.target);
        // Trigger click after touch feedback
        setTimeout(() => {
          e.target.click();
        }, 50);
      }, { passive: false });
    });
  }

  setupAccessibility() {
    // Announce calculator state changes
    this.display.setAttribute('aria-live', 'assertive');
    this.history.setAttribute('aria-live', 'polite');

    // Add role and description
    this.calculator.setAttribute('role', 'application');
    this.calculator.setAttribute('aria-label', 'Calculator application');

    // Focus management
    this.calculator.addEventListener('focusin', () => {
      this.calculator.classList.add('keyboard-focused');
    });

    this.calculator.addEventListener('focusout', () => {
      this.calculator.classList.remove('keyboard-focused');
    });
  }

  animateButtonPress(button) {
    // Remove existing animation
    button.classList.remove('pressed');
    
    // Trigger reflow
    button.offsetHeight;
    
    // Add animation class
    button.classList.add('pressed');
    
    // Remove after animation
    setTimeout(() => {
      button.classList.remove('pressed');
    }, 300);
  }

  playClickFeedback(button) {
    // Visual feedback based on button type
    if (button.classList.contains('btn-number')) {
      this.animateDisplay('number-entered');
    } else if (button.classList.contains('btn-operation')) {
      this.animateDisplay('operation-entered');
      this.highlightOperation(button);
    } else if (button.classList.contains('btn-equals')) {
      this.animateDisplay('calculating');
    }
  }

  animateDisplay(animationType) {
    this.display.classList.remove('number-entered', 'operation-entered', 'calculating', 'error');
    
    // Trigger reflow
    this.display.offsetHeight;
    
    this.display.classList.add(animationType);
    
    setTimeout(() => {
      this.display.classList.remove(animationType);
    }, 200);
  }

  highlightOperation(button) {
    // Remove active state from all operation buttons
    this.buttons.forEach(btn => {
      if (btn.classList.contains('btn-operation')) {
        btn.classList.remove('active');
      }
    });
    
    // Add active state to current operation
    button.classList.add('active');
  }

  addHoverEffect(button) {
    if (!button.matches(':active')) {
      button.style.transform = 'translateY(-2px)';
    }
  }

  removeHoverEffect(button) {
    if (!button.matches(':active')) {
      button.style.transform = '';
    }
  }

  addTouchFeedback(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
  }

  removeTouchFeedback(button) {
    button.style.transform = '';
    button.style.transition = '';
  }

  // Utility methods for future calculator logic integration
  updateDisplay(value) {
    this.display.textContent = value;
    this.announceToScreenReader(`Display shows ${value}`);
  }

  updateHistory(value) {
    this.history.textContent = value;
  }

  showError(message = 'Error') {
    this.display.textContent = message;
    this.display.classList.add('error');
    this.announceToScreenReader(`Error: ${message}`);
    
    setTimeout(() => {
      this.display.classList.remove('error');
    }, 1000);
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Reset calculator state
  reset() {
    this.display.textContent = '0';
    this.history.textContent = '';
    this.buttons.forEach(btn => {
      btn.classList.remove('active');
    });
  }
}

// Initialize calculator UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.calculator')) {
    new CalculatorUI();
  }
});

export default CalculatorUI;