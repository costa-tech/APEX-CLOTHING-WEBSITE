/**
 * Advanced Image Optimization Utility
 * Implements responsive images, WebP support, and intelligent loading
 */

class ImageOptimizer {
  constructor() {
    this.webpSupported = null;
    this.avifSupported = null;
    this.checkFormatSupport();
    
    // Image loading queue for batch processing
    this.loadingQueue = [];
    this.processingQueue = false;
    
    console.log('🖼️ Image optimizer initialized');
  }

  /**
   * Check browser support for modern image formats
   */
  async checkFormatSupport() {
    // Check WebP support
    this.webpSupported = await this.checkImageFormat('data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA');
    
    // Check AVIF support  
    this.avifSupported = await this.checkImageFormat('data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=');
    
    console.log(`📸 Format support - WebP: ${this.webpSupported}, AVIF: ${this.avifSupported}`);
  }

  /**
   * Check if browser supports specific image format
   */
  checkImageFormat(dataUri) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = dataUri;
    });
  }

  /**
   * Generate responsive image URLs with format optimization
   */
  generateResponsiveUrls(baseUrl, sizes = [320, 640, 1024, 1280, 1920]) {
    const urls = {};
    
    sizes.forEach(size => {
      // Priority: AVIF > WebP > Original
      if (this.avifSupported) {
        urls[size] = this.transformImageUrl(baseUrl, size, 'avif');
      } else if (this.webpSupported) {
        urls[size] = this.transformImageUrl(baseUrl, size, 'webp');
      } else {
        urls[size] = this.transformImageUrl(baseUrl, size);
      }
    });
    
    return urls;
  }

  /**
   * Transform image URL for optimization services
   */
  transformImageUrl(url, width, format = null) {
    // This would integrate with image CDN services like Cloudinary, ImageKit, etc.
    // For now, we'll simulate the transformation
    
    if (url.includes('cloudinary.com') || url.includes('imagekit.io')) {
      // Already optimized URL
      return url;
    }
    
    // Simulate CDN transformation
    const params = [`w_${width}`, 'c_fill', 'q_auto', 'f_auto'];
    if (format) params.push(`f_${format}`);
    
    // For local development, return original URL
    return url;
  }

  /**
   * Create responsive image element with optimized sources
   */
  createResponsiveImage(src, alt = '', className = '', sizes = '100vw') {
    const picture = document.createElement('picture');
    
    // Generate responsive URLs
    const responsiveUrls = this.generateResponsiveUrls(src);
    
    // Add AVIF source if supported
    if (this.avifSupported) {
      const avifSource = document.createElement('source');
      avifSource.type = 'image/avif';
      avifSource.srcset = Object.entries(responsiveUrls)
        .map(([width, url]) => `${url} ${width}w`)
        .join(', ');
      avifSource.sizes = sizes;
      picture.appendChild(avifSource);
    }
    
    // Add WebP source if supported
    if (this.webpSupported) {
      const webpSource = document.createElement('source');
      webpSource.type = 'image/webp';
      webpSource.srcset = Object.entries(responsiveUrls)
        .map(([width, url]) => `${url} ${width}w`)
        .join(', ');
      webpSource.sizes = sizes;
      picture.appendChild(webpSource);
    }
    
    // Fallback img element
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = className;
    img.loading = 'lazy';
    img.decoding = 'async';
    
    picture.appendChild(img);
    return picture;
  }

  /**
   * Preload critical images above the fold
   */
  preloadCriticalImages(imageUrls) {
    imageUrls.forEach((url, index) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      
      // High priority for first few images
      if (index < 3) {
        link.fetchPriority = 'high';
      }
      
      document.head.appendChild(link);
      console.log(`🎯 Preloading critical image: ${url}`);
    });
  }

  /**
   * Lazy load images with intersection observer
   */
  setupLazyLoading(images) {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without Intersection Observer
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Load individual image with error handling
   */
  async loadImage(img) {
    return new Promise((resolve, reject) => {
      const tempImg = new Image();
      
      tempImg.onload = () => {
        // Fade in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        // Trigger fade in
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });
        
        console.log(`✅ Loaded image: ${img.src}`);
        resolve();
      };
      
      tempImg.onerror = () => {
        // Fallback to placeholder
        img.src = '/images/placeholder.svg';
        console.warn(`❌ Failed to load image: ${img.dataset.src || img.src}`);
        reject();
      };
      
      tempImg.src = img.dataset.src || img.src;
    });
  }

  /**
   * Optimize images already in the DOM
   */
  optimizeExistingImages() {
    const images = document.querySelectorAll('img[data-optimize="true"]');
    
    images.forEach(img => {
      // Add responsive attributes if missing
      if (!img.srcset && img.src) {
        const responsiveUrls = this.generateResponsiveUrls(img.src);
        img.srcset = Object.entries(responsiveUrls)
          .map(([width, url]) => `${url} ${width}w`)
          .join(', ');
        img.sizes = img.dataset.sizes || '100vw';
      }
      
      // Add loading and decoding attributes
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
    });
    
    console.log(`🔧 Optimized ${images.length} existing images`);
  }

  /**
   * Generate placeholder for loading states
   */
  generatePlaceholder(width, height, color = '#f0f0f0') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }

  /**
   * Monitor image loading performance
   */
  trackImagePerformance(img) {
    const startTime = performance.now();
    
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === img.src) {
          const loadTime = entry.responseEnd - entry.startTime;
          console.log(`📊 Image load time: ${loadTime.toFixed(2)}ms for ${img.src}`);
          
          // Track with global performance monitor if available
          if (window.performanceMonitor) {
            window.performanceMonitor.trackCustomMetric('imageLoadTime', loadTime);
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Get optimization report
   */
  getOptimizationReport() {
    return {
      formatSupport: {
        webp: this.webpSupported,
        avif: this.avifSupported
      },
      optimizedImages: document.querySelectorAll('img[data-optimize="true"]').length,
      lazyImages: document.querySelectorAll('img[loading="lazy"]').length,
      responsiveImages: document.querySelectorAll('img[srcset]').length
    };
  }
}

// Create and export singleton instance
const imageOptimizer = new ImageOptimizer();

// Auto-optimize images when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer.optimizeExistingImages();
  });
} else {
  imageOptimizer.optimizeExistingImages();
}

export { imageOptimizer };
export default ImageOptimizer;
