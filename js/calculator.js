// Calculator Logic Engine

class Calculator {
  constructor() {
    this.display = document.getElementById('calc-display');
    this.history = document.getElementById('calc-history');
    this.buttons = document.querySelectorAll('.calc-btn');
    
    if (!this.display) return;
    
    this.reset();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardInput();
  }

  reset() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.waitingForOperand = false;
    this.justCalculated = false;
    this.updateDisplay();
    this.updateHistory('');
  }

  setupEventListeners() {
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleButtonClick(e.target);
      });
    });
    
    // Listen for history result usage
    document.addEventListener('useHistoryResult', (e) => {
      this.currentValue = e.detail.result;
      this.updateDisplay();
      this.justCalculated = true;
    });
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (e) => {
      if (!document.querySelector('.calculator').matches(':focus-within')) return;
      
      const key = e.key;
      e.preventDefault();
      
      if (/[0-9]/.test(key)) {
        this.inputNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        this.inputOperation(key);
      } else if (key === '=' || key === 'Enter') {
        this.calculate();
      } else if (key === '.') {
        this.inputDecimal();
      } else if (key === 'Escape') {
        this.clear();
      } else if (key === 'Backspace') {
        this.backspace();
      } else if (key === 'Delete') {
        this.clearEntry();
      }
    });
  }

  handleButtonClick(button) {
    const number = button.dataset.number;
    const operation = button.dataset.operation;
    const action = button.dataset.action;

    if (number !== undefined) {
      this.inputNumber(number);
    } else if (operation) {
      this.inputOperation(operation);
    } else if (action) {
      this.handleAction(action);
    }
  }

  handleAction(action) {
    switch (action) {
      case 'clear':
        this.clear();
        break;
      case 'clear-entry':
        this.clearEntry();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'decimal':
        this.inputDecimal();
        break;
      case 'equals':
        this.calculate();
        break;
    }
  }

  inputNumber(num) {
    if (this.waitingForOperand || this.justCalculated) {
      this.currentValue = num;
      this.waitingForOperand = false;
      this.justCalculated = false;
    } else {
      this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
    }
    this.updateDisplay();
  }

  inputOperation(nextOperation) {
    const inputValue = parseFloat(this.currentValue);

    if (this.previousValue === null) {
      this.previousValue = inputValue;
    } else if (this.operation && !this.waitingForOperand) {
      const result = this.performCalculation();
      
      if (result === null) return; // Error occurred
      
      this.currentValue = String(result);
      this.previousValue = result;
      this.updateDisplay();
    }

    this.waitingForOperand = true;
    this.operation = nextOperation;
    this.justCalculated = false;
    
    this.updateHistory(`${this.formatNumber(this.previousValue)} ${this.getOperationSymbol(nextOperation)}`);
  }

  inputDecimal() {
    if (this.waitingForOperand || this.justCalculated) {
      this.currentValue = '0.';
      this.waitingForOperand = false;
      this.justCalculated = false;
    } else if (this.currentValue.indexOf('.') === -1) {
      this.currentValue += '.';
    }
    this.updateDisplay();
  }

  calculate() {
    if (this.operation && this.previousValue !== null && !this.waitingForOperand) {
      const result = this.performCalculation();
      
      if (result === null) return; // Error occurred
      
      const expression = `${this.formatNumber(this.previousValue)} ${this.getOperationSymbol(this.operation)} ${this.formatNumber(parseFloat(this.currentValue))}`;
      this.updateHistory(`${expression} =`);
      
      this.currentValue = String(result);
      this.previousValue = null;
      this.operation = null;
      this.waitingForOperand = false;
      this.justCalculated = true;
      
      this.updateDisplay();
      
      // Dispatch calculation complete event for history
      document.dispatchEvent(new CustomEvent('calculationComplete', {
        detail: {
          expression,
          result: this.formatNumber(result)
        }
      }));
    }
  }

  performCalculation() {
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    
    if (isNaN(prev) || isNaN(current)) {
      this.showError('Invalid input');
      return null;
    }

    let result;
    
    try {
      switch (this.operation) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            this.showError('Cannot divide by zero');
            return null;
          }
          result = prev / current;
          break;
        default:
          return null;
      }
      
      // Handle floating point precision
      result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;
      
      // Check for overflow
      if (!isFinite(result)) {
        this.showError('Result too large');
        return null;
      }
      
      return result;
      
    } catch (error) {
      this.showError('Calculation error');
      return null;
    }
  }

  clear() {
    this.reset();
  }

  clearEntry() {
    this.currentValue = '0';
    this.updateDisplay();
  }

  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const formatted = this.formatNumber(parseFloat(this.currentValue));
    this.display.textContent = formatted;
    
    // Add animation class
    this.display.classList.add('number-entered');
    setTimeout(() => {
      this.display.classList.remove('number-entered');
    }, 200);
  }

  updateHistory(text) {
    this.history.textContent = text;
  }

  formatNumber(num) {
    if (isNaN(num)) return '0';
    
    // Handle very large or very small numbers
    if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-6 && num !== 0)) {
      return num.toExponential(6);
    }
    
    // Format with appropriate decimal places
    const str = num.toString();
    
    // If it's a whole number, don't show decimals
    if (num % 1 === 0) {
      return num.toLocaleString();
    }
    
    // Limit decimal places for display
    const decimalPlaces = Math.min(8, str.split('.')[1]?.length || 0);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimalPlaces
    });
  }

  getOperationSymbol(operation) {
    const symbols = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operation] || operation;
  }

  showError(message) {
    this.display.textContent = message;
    this.display.classList.add('error');
    
    // Reset after showing error
    setTimeout(() => {
      this.display.classList.remove('error');
      this.reset();
    }, 2000);
    
    // Announce error to screen readers
    this.announceToScreenReader(`Error: ${message}`);
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.calculator')) {
    new Calculator();
  }
});

export default Calculator;