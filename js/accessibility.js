// Accessibility Enhancement System
class AccessibilityManager {
    constructor() {
        this.focusManager = new FocusManager();
        this.screenReaderManager = new ScreenReaderManager();
        this.keyboardManager = new KeyboardManager();
        this.init();
    }

    init() {
        this.setupARIALabels();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
        this.checkColorContrast();
    }

    setupARIALabels() {
        // Add missing ARIA labels
        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
            const text = button.textContent.trim() || button.title || 'Button';
            button.setAttribute('aria-label', text);
        });

        // Add role attributes where needed
        document.querySelectorAll('.gallery-grid').forEach(grid => {
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-label', 'Image gallery');
        });

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.setAttribute('role', 'gridcell');
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation for gallery items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', this.handleGalleryKeydown.bind(this));
        });

        // Calculator keyboard support
        document.addEventListener('keydown', this.handleCalculatorKeydown.bind(this));
    }

    setupFocusManagement() {
        // Focus trap for lightbox
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const lightbox = document.querySelector('.lightbox');
                if (lightbox) {
                    lightbox.remove();
                }
            }
        });

        // Skip link functionality
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView();
                }
            });
        }
    }

    setupScreenReaderSupport() {
        // Live regions for dynamic content
        this.createLiveRegion();
        
        // Image alt text validation
        document.querySelectorAll('img').forEach(img => {
            if (!img.alt && !img.getAttribute('aria-hidden')) {
                img.alt = img.title || 'Image';
            }
        });
    }

    createLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    handleGalleryKeydown(e) {\n        const item = e.currentTarget;\n        const items = Array.from(document.querySelectorAll('.gallery-item'));\n        const currentIndex = items.indexOf(item);\n\n        switch (e.key) {\n            case 'Enter':\n            case ' ':\n                e.preventDefault();\n                const viewBtn = item.querySelector('.view-btn');\n                if (viewBtn) viewBtn.click();\n                break;\n            case 'Delete':\n                e.preventDefault();\n                const deleteBtn = item.querySelector('.delete-btn');\n                if (deleteBtn) deleteBtn.click();\n                break;\n            case 'ArrowRight':\n                e.preventDefault();\n                const nextItem = items[currentIndex + 1] || items[0];\n                nextItem.focus();\n                break;\n            case 'ArrowLeft':\n                e.preventDefault();\n                const prevItem = items[currentIndex - 1] || items[items.length - 1];\n                prevItem.focus();\n                break;\n        }\n    }\n\n    handleCalculatorKeydown(e) {\n        if (document.activeElement.closest('.calculator-container')) {\n            const key = e.key;\n            if (/[0-9+\\-*/=.]/.test(key) || key === 'Enter' || key === 'Escape') {\n                e.preventDefault();\n                \n                if (key === 'Enter') {\n                    document.querySelector('[data-action=\"calculate\"]')?.click();\n                } else if (key === 'Escape') {\n                    document.querySelector('[data-action=\"clear\"]')?.click();\n                } else {\n                    const button = document.querySelector(`[data-value=\"${key}\"]`);\n                    if (button) button.click();\n                }\n            }\n        }\n    }\n\n    checkColorContrast() {\n        // Basic color contrast checking\n        const elements = document.querySelectorAll('*');\n        elements.forEach(el => {\n            const styles = getComputedStyle(el);\n            const bgColor = styles.backgroundColor;\n            const textColor = styles.color;\n            \n            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {\n                const contrast = this.calculateContrast(bgColor, textColor);\n                if (contrast < 4.5) {\n                    console.warn('Low contrast detected:', el, `Contrast: ${contrast.toFixed(2)}`);\n                }\n            }\n        });\n    }\n\n    calculateContrast(bg, fg) {\n        // Simplified contrast calculation\n        const bgLum = this.getLuminance(bg);\n        const fgLum = this.getLuminance(fg);\n        const lighter = Math.max(bgLum, fgLum);\n        const darker = Math.min(bgLum, fgLum);\n        return (lighter + 0.05) / (darker + 0.05);\n    }\n\n    getLuminance(color) {\n        // Simplified luminance calculation\n        const rgb = color.match(/\\d+/g);\n        if (!rgb) return 0;\n        const [r, g, b] = rgb.map(c => {\n            c = parseInt(c) / 255;\n            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);\n        });\n        return 0.2126 * r + 0.7152 * g + 0.0722 * b;\n    }\n}\n\n// Focus Management\nclass FocusManager {\n    constructor() {\n        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])';\n    }\n\n    trapFocus(container) {\n        const focusable = container.querySelectorAll(this.focusableElements);\n        const firstFocusable = focusable[0];\n        const lastFocusable = focusable[focusable.length - 1];\n\n        container.addEventListener('keydown', (e) => {\n            if (e.key === 'Tab') {\n                if (e.shiftKey) {\n                    if (document.activeElement === firstFocusable) {\n                        e.preventDefault();\n                        lastFocusable.focus();\n                    }\n                } else {\n                    if (document.activeElement === lastFocusable) {\n                        e.preventDefault();\n                        firstFocusable.focus();\n                    }\n                }\n            }\n        });\n\n        firstFocusable.focus();\n    }\n}\n\n// Screen Reader Support\nclass ScreenReaderManager {\n    constructor() {\n        this.setupLiveRegions();\n    }\n\n    setupLiveRegions() {\n        // Calculator announcements\n        const calculatorDisplay = document.querySelector('.calculator-display');\n        if (calculatorDisplay) {\n            calculatorDisplay.setAttribute('aria-live', 'polite');\n            calculatorDisplay.setAttribute('aria-atomic', 'true');\n        }\n\n        // Gallery announcements\n        const galleryCount = document.querySelector('.gallery-count');\n        if (galleryCount) {\n            galleryCount.setAttribute('aria-live', 'polite');\n        }\n    }\n}\n\n// Keyboard Navigation\nclass KeyboardManager {\n    constructor() {\n        this.setupGlobalKeyboardShortcuts();\n    }\n\n    setupGlobalKeyboardShortcuts() {\n        document.addEventListener('keydown', (e) => {\n            // Alt + 1-5 for navigation\n            if (e.altKey && e.key >= '1' && e.key <= '5') {\n                e.preventDefault();\n                const navLinks = document.querySelectorAll('.nav-link');\n                const index = parseInt(e.key) - 1;\n                if (navLinks[index]) {\n                    navLinks[index].click();\n                }\n            }\n        });\n    }\n}\n\n// Initialize accessibility features\nconst accessibilityManager = new AccessibilityManager();\n\nexport { AccessibilityManager, FocusManager, ScreenReaderManager, KeyboardManager };", "newStr": "// Accessibility Enhancement System\nclass AccessibilityManager {\n    constructor() {\n        this.focusManager = new FocusManager();\n        this.screenReaderManager = new ScreenReaderManager();\n        this.keyboardManager = new KeyboardManager();\n        this.init();\n    }\n\n    init() {\n        this.setupARIALabels();\n        this.setupKeyboardNavigation();\n        this.setupFocusManagement();\n        this.setupScreenReaderSupport();\n        this.checkColorContrast();\n    }\n\n    setupARIALabels() {\n        // Add missing ARIA labels\n        document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {\n            const text = button.textContent.trim() || button.title || 'Button';\n            button.setAttribute('aria-label', text);\n        });\n\n        // Add role attributes where needed\n        document.querySelectorAll('.gallery-grid').forEach(grid => {\n            grid.setAttribute('role', 'grid');\n            grid.setAttribute('aria-label', 'Image gallery');\n        });\n\n        document.querySelectorAll('.gallery-item').forEach(item => {\n            item.setAttribute('role', 'gridcell');\n        });\n    }\n\n    setupKeyboardNavigation() {\n        // Tab navigation for gallery items\n        document.querySelectorAll('.gallery-item').forEach((item, index) => {\n            item.setAttribute('tabindex', '0');\n            item.addEventListener('keydown', this.handleGalleryKeydown.bind(this));\n        });\n\n        // Calculator keyboard support\n        document.addEventListener('keydown', this.handleCalculatorKeydown.bind(this));\n    }\n\n    setupFocusManagement() {\n        // Focus trap for lightbox\n        document.addEventListener('keydown', (e) => {\n            if (e.key === 'Escape') {\n                const lightbox = document.querySelector('.lightbox');\n                if (lightbox) {\n                    lightbox.remove();\n                }\n            }\n        });\n\n        // Skip link functionality\n        const skipLink = document.querySelector('.skip-link');\n        if (skipLink) {\n            skipLink.addEventListener('click', (e) => {\n                e.preventDefault();\n                const target = document.querySelector(skipLink.getAttribute('href'));\n                if (target) {\n                    target.focus();\n                    target.scrollIntoView();\n                }\n            });\n        }\n    }\n\n    setupScreenReaderSupport() {\n        // Live regions for dynamic content\n        this.createLiveRegion();\n        \n        // Image alt text validation\n        document.querySelectorAll('img').forEach(img => {\n            if (!img.alt && !img.getAttribute('aria-hidden')) {\n                img.alt = img.title || 'Image';\n            }\n        });\n    }\n\n    createLiveRegion() {\n        const liveRegion = document.createElement('div');\n        liveRegion.id = 'live-region';\n        liveRegion.setAttribute('aria-live', 'polite');\n        liveRegion.setAttribute('aria-atomic', 'true');\n        liveRegion.style.position = 'absolute';\n        liveRegion.style.left = '-10000px';\n        liveRegion.style.width = '1px';\n        liveRegion.style.height = '1px';\n        liveRegion.style.overflow = 'hidden';\n        document.body.appendChild(liveRegion);\n    }\n\n    announceToScreenReader(message) {\n        const liveRegion = document.getElementById('live-region');\n        if (liveRegion) {\n            liveRegion.textContent = message;\n        }\n    }\n\n    handleGalleryKeydown(e) {\n        const item = e.currentTarget;\n        const items = Array.from(document.querySelectorAll('.gallery-item'));\n        const currentIndex = items.indexOf(item);\n\n        switch (e.key) {\n            case 'Enter':\n            case ' ':\n                e.preventDefault();\n                const viewBtn = item.querySelector('.view-btn');\n                if (viewBtn) viewBtn.click();\n                break;\n            case 'Delete':\n                e.preventDefault();\n                const deleteBtn = item.querySelector('.delete-btn');\n                if (deleteBtn) deleteBtn.click();\n                break;\n            case 'ArrowRight':\n                e.preventDefault();\n                const nextItem = items[currentIndex + 1] || items[0];\n                nextItem.focus();\n                break;\n            case 'ArrowLeft':\n                e.preventDefault();\n                const prevItem = items[currentIndex - 1] || items[items.length - 1];\n                prevItem.focus();\n                break;\n        }\n    }\n\n    handleCalculatorKeydown(e) {\n        if (document.activeElement.closest('.calculator-container')) {\n            const key = e.key;\n            if (/[0-9+\\-*/=.]/.test(key) || key === 'Enter' || key === 'Escape') {\n                e.preventDefault();\n                \n                if (key === 'Enter') {\n                    document.querySelector('[data-action=\"calculate\"]')?.click();\n                } else if (key === 'Escape') {\n                    document.querySelector('[data-action=\"clear\"]')?.click();\n                } else {\n                    const button = document.querySelector(`[data-value=\"${key}\"]`);\n                    if (button) button.click();\n                }\n            }\n        }\n    }\n\n    checkColorContrast() {\n        // Basic color contrast checking\n        const elements = document.querySelectorAll('*');\n        elements.forEach(el => {\n            const styles = getComputedStyle(el);\n            const bgColor = styles.backgroundColor;\n            const textColor = styles.color;\n            \n            if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {\n                const contrast = this.calculateContrast(bgColor, textColor);\n                if (contrast < 4.5) {\n                    console.warn('Low contrast detected:', el, `Contrast: ${contrast.toFixed(2)}`);\n                }\n            }\n        });\n    }\n\n    calculateContrast(bg, fg) {\n        // Simplified contrast calculation\n        const bgLum = this.getLuminance(bg);\n        const fgLum = this.getLuminance(fg);\n        const lighter = Math.max(bgLum, fgLum);\n        const darker = Math.min(bgLum, fgLum);\n        return (lighter + 0.05) / (darker + 0.05);\n    }\n\n    getLuminance(color) {\n        // Simplified luminance calculation\n        const rgb = color.match(/\\d+/g);\n        if (!rgb) return 0;\n        const [r, g, b] = rgb.map(c => {\n            c = parseInt(c) / 255;\n            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);\n        });\n        return 0.2126 * r + 0.7152 * g + 0.0722 * b;\n    }\n}\n\n// Focus Management\nclass FocusManager {\n    constructor() {\n        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])';\n    }\n\n    trapFocus(container) {\n        const focusable = container.querySelectorAll(this.focusableElements);\n        const firstFocusable = focusable[0];\n        const lastFocusable = focusable[focusable.length - 1];\n\n        container.addEventListener('keydown', (e) => {\n            if (e.key === 'Tab') {\n                if (e.shiftKey) {\n                    if (document.activeElement === firstFocusable) {\n                        e.preventDefault();\n                        lastFocusable.focus();\n                    }\n                } else {\n                    if (document.activeElement === lastFocusable) {\n                        e.preventDefault();\n                        firstFocusable.focus();\n                    }\n                }\n            }\n        });\n\n        firstFocusable.focus();\n    }\n}\n\n// Screen Reader Support\nclass ScreenReaderManager {\n    constructor() {\n        this.setupLiveRegions();\n    }\n\n    setupLiveRegions() {\n        // Calculator announcements\n        const calculatorDisplay = document.querySelector('.calculator-display');\n        if (calculatorDisplay) {\n            calculatorDisplay.setAttribute('aria-live', 'polite');\n            calculatorDisplay.setAttribute('aria-atomic', 'true');\n        }\n\n        // Gallery announcements\n        const galleryCount = document.querySelector('.gallery-count');\n        if (galleryCount) {\n            galleryCount.setAttribute('aria-live', 'polite');\n        }\n    }\n}\n\n// Keyboard Navigation\nclass KeyboardManager {\n    constructor() {\n        this.setupGlobalKeyboardShortcuts();\n    }\n\n    setupGlobalKeyboardShortcuts() {\n        document.addEventListener('keydown', (e) => {\n            // Alt + 1-5 for navigation\n            if (e.altKey && e.key >= '1' && e.key <= '5') {\n                e.preventDefault();\n                const navLinks = document.querySelectorAll('.nav-link');\n                const index = parseInt(e.key) - 1;\n                if (navLinks[index]) {\n                    navLinks[index].click();\n                }\n            }\n        });\n    }\n}\n\n// Initialize accessibility features\nconst accessibilityManager = new AccessibilityManager();\n\nexport { AccessibilityManager, FocusManager, ScreenReaderManager, KeyboardManager };"}