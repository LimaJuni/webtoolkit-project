// IndexedDB Image Storage System
class ImageStorage {
    constructor() {
        this.dbName = 'GalleryDB';
        this.version = 1;
        this.db = null;
        this.init();
    }

    async init() {
        try {
            this.db = await this.openDB();
        } catch (error) {
            console.error('Failed to initialize IndexedDB:', error);
            // Fallback to localStorage
        }
    }

    openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('images')) {
                    const store = db.createObjectStore('images', { keyPath: 'id' });
                    store.createIndex('uploadDate', 'uploadDate', { unique: false });
                    store.createIndex('name', 'name', { unique: false });
                }
            };
        });
    }

    async storeImage(imageData) {
        if (!this.db) {
            // Fallback to localStorage
            return this.storeInLocalStorage(imageData);
        }

        try {
            const transaction = this.db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            await store.add(imageData);
            return imageData.id;
        } catch (error) {
            console.error('Error storing image:', error);
            return this.storeInLocalStorage(imageData);
        }
    }

    async getAllImages() {
        if (!this.db) {
            return this.getFromLocalStorage();
        }

        try {
            const transaction = this.db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            const request = store.getAll();
            
            return new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Error getting images:', error);
            return this.getFromLocalStorage();
        }
    }

    async deleteImage(id) {
        if (!this.db) {
            return this.deleteFromLocalStorage(id);
        }

        try {
            const transaction = this.db.transaction(['images'], 'readwrite');
            const store = transaction.objectStore('images');
            await store.delete(id);
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            return this.deleteFromLocalStorage(id);
        }
    }

    // LocalStorage fallback methods
    storeInLocalStorage(imageData) {
        try {
            const images = this.getFromLocalStorage();
            images.push(imageData);
            localStorage.setItem('gallery-images', JSON.stringify(images));
            return imageData.id;
        } catch (error) {
            console.error('LocalStorage error:', error);
            return null;
        }
    }

    getFromLocalStorage() {
        try {
            const saved = localStorage.getItem('gallery-images');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('LocalStorage error:', error);
            return [];
        }
    }

    deleteFromLocalStorage(id) {
        try {
            const images = this.getFromLocalStorage();
            const filtered = images.filter(img => img.id !== id);
            localStorage.setItem('gallery-images', JSON.stringify(filtered));
            return true;
        } catch (error) {
            console.error('LocalStorage error:', error);
            return false;
        }
    }
}

// Image Compression Utilities
class ImageCompressor {
    static compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    static createThumbnail(file, size = 300) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(size / img.width, size / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
}

// Progressive Loading Manager
class ProgressiveLoader {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            rootMargin: '50px'
        });
    }

    observe(element) {
        this.observer.observe(element);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src;
                
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    this.observer.unobserve(img);
                }
            }
        });
    }
}

export { ImageStorage, ImageCompressor, ProgressiveLoader };