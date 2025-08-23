// Gallery Management System
class GalleryManager {
    constructor() {
        this.images = [];
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadImages();
        this.updateGalleryDisplay();
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('upload-btn');

        // Drag and drop
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        
        // Click upload
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
        e.target.value = ''; // Reset input
    }

    async processFiles(files) {
        const validFiles = files.filter(file => this.validateFile(file));
        
        for (const file of validFiles) {
            try {
                const imageData = await this.createImageData(file);
                this.images.push(imageData);
            } catch (error) {
                console.error('Error processing file:', error);
            }
        }
        
        this.saveImages();
        this.updateGalleryDisplay();
    }

    validateFile(file) {
        if (!this.supportedFormats.includes(file.type)) {
            alert(`Unsupported format: ${file.type}`);
            return false;
        }
        
        if (file.size > this.maxFileSize) {
            alert(`File too large: ${file.name} (max 10MB)`);
            return false;
        }
        
        return true;
    }

    createImageData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Create thumbnail
                    const maxSize = 300;
                    const ratio = Math.min(maxSize / img.width, maxSize / img.height);
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;
                    
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    resolve({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        uploadDate: new Date().toISOString(),
                        thumbnail: canvas.toDataURL('image/jpeg', 0.8),
                        original: e.target.result,
                        width: img.width,
                        height: img.height
                    });
                };
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    saveImages() {
        try {
            localStorage.setItem('gallery-images', JSON.stringify(this.images));
        } catch (error) {
            console.error('Error saving images:', error);
        }
    }

    loadImages() {
        try {
            const saved = localStorage.getItem('gallery-images');
            this.images = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading images:', error);
            this.images = [];
        }
    }

    updateGalleryDisplay() {
        const galleryGrid = document.getElementById('gallery-grid');
        const galleryEmpty = document.getElementById('gallery-empty');
        const galleryCount = document.getElementById('gallery-count');
        
        galleryCount.textContent = `${this.images.length} image${this.images.length !== 1 ? 's' : ''}`;
        
        if (this.images.length === 0) {
            galleryEmpty.style.display = 'block';
            galleryGrid.style.display = 'none';
            return;
        }
        
        galleryEmpty.style.display = 'none';
        galleryGrid.style.display = 'grid';
        
        galleryGrid.innerHTML = this.images.map(image => `
            <div class="gallery-item" data-id="${image.id}">
                <img src="${image.thumbnail}" alt="${image.name}" loading="lazy">
                <div class="gallery-item-overlay">
                    <button class="gallery-btn view-btn" onclick="gallery.viewImage('${image.id}')" aria-label="View ${image.name}">👁️</button>
                    <button class="gallery-btn delete-btn" onclick="gallery.deleteImage('${image.id}')" aria-label="Delete ${image.name}">🗑️</button>
                </div>
                <div class="gallery-item-info">
                    <div class="image-name">${image.name}</div>
                    <div class="image-size">${this.formatFileSize(image.size)}</div>
                </div>
            </div>
        `).join('');
    }

    viewImage(id) {
        const image = this.images.find(img => img.id == id);
        if (!image) return;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
                <img src="${image.original}" alt="${image.name}">
                <div class="lightbox-info">
                    <h3>${image.name}</h3>
                    <p>${image.width} × ${image.height} • ${this.formatFileSize(image.size)}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.remove();
        });
    }

    deleteImage(id) {
        if (!confirm('Delete this image?')) return;
        
        this.images = this.images.filter(img => img.id != id);
        this.saveImages();
        this.updateGalleryDisplay();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

// Initialize gallery
const gallery = new GalleryManager();