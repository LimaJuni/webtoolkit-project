// Demo Integration for Gamification Testing

document.addEventListener('DOMContentLoaded', () => {
  // Add demo buttons for testing gamification
  const demoSection = document.createElement('div');
  demoSection.className = 'demo-controls';
  demoSection.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: var(--color-neutral-50);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    border: 1px solid var(--color-neutral-200);
  `;
  
  demoSection.innerHTML = `
    <h4 style="margin: 0 0 var(--space-2) 0; font-size: var(--text-sm); color: var(--color-neutral-700);">Demo Controls</h4>
    <button id="demo-calc" class="demo-btn">Test Calculation (+5 XP)</button>
    <button id="demo-contact" class="demo-btn">Test Contact (+10 XP)</button>
    <button id="demo-image" class="demo-btn">Test Image (+15 XP)</button>
    <button id="demo-reset" class="demo-btn reset">Reset Progress</button>
  `;
  
  // Add demo button styles
  const style = document.createElement('style');
  style.textContent = `
    .demo-btn {
      padding: var(--space-2) var(--space-3);
      border: none;
      border-radius: var(--radius-base);
      background: var(--color-primary-600);
      color: white;
      font-size: var(--text-xs);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .demo-btn:hover {
      background: var(--color-primary-700);
      transform: translateY(-1px);
    }
    .demo-btn.reset {
      background: var(--color-error);
    }
    .demo-btn.reset:hover {
      background: #dc2626;
    }
    [data-theme="dark"] .demo-controls {
      background: var(--color-neutral-100);
      border-color: var(--color-neutral-300);
    }
    [data-theme="dark"] .demo-controls h4 {
      color: var(--color-neutral-800);
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(demoSection);
  
  // Add event listeners
  document.getElementById('demo-calc').addEventListener('click', () => {
    if (window.gamificationSystem) {
      window.gamificationSystem.triggerCalculation();
    }
  });
  
  document.getElementById('demo-contact').addEventListener('click', () => {
    if (window.gamificationSystem) {
      window.gamificationSystem.triggerContactAdd();
    }
  });
  
  document.getElementById('demo-image').addEventListener('click', () => {
    if (window.gamificationSystem) {
      window.gamificationSystem.triggerImageUpload();
    }
  });
  
  document.getElementById('demo-reset').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('webtoolkit_player');
      localStorage.removeItem('webtoolkit_last_reset');
      location.reload();
    }
  });
  
  // Hide demo controls in production
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    demoSection.style.display = 'none';
  }
});