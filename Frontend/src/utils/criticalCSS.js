/**
 * Critical CSS Manager
 * Extracts and inlines critical CSS for above-the-fold content
 */

class CriticalCSSManager {
  constructor() {
    this.criticalSelectors = new Set();
    this.aboveFoldElements = new Set();
    this.criticalCSS = '';
    this.deferredCSS = [];
    
    // Initialize critical CSS detection
    this.initializeCriticalDetection();
    
    console.log('🎨 Critical CSS manager initialized');
  }

  /**
   * Initialize critical CSS detection for above-the-fold content
   */
  initializeCriticalDetection() {
    // Common critical selectors for e-commerce
    const commonCriticalSelectors = [
      'body', 'html',
      '.header', '.navbar', '.nav',
      '.hero', '.banner', '.splash',
      '.logo', '.brand',
      '.loading', '.spinner',
      '.grid', '.container', '.wrapper',
      '.btn-primary', '.btn-secondary',
      '.product-card:nth-child(-n+4)', // First 4 product cards
      '.breadcrumb',
      '.search-bar',
      '.cart-icon'
    ];

    commonCriticalSelectors.forEach(selector => {
      this.criticalSelectors.add(selector);
    });

    // Detect viewport-specific critical elements
    this.detectAboveFoldElements();
  }

  /**
   * Detect elements that are above the fold
   */
  detectAboveFoldElements() {
    const viewportHeight = window.innerHeight;
    
    // Wait for DOM to be ready
    const detectElements = () => {
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        
        // Element is above the fold if its top is within viewport
        if (rect.top >= 0 && rect.top < viewportHeight) {
          this.aboveFoldElements.add(element);
          
          // Add element's classes as critical selectors
          if (element.className) {
            const classes = element.className.toString().split(' ');
            classes.forEach(cls => {
              if (cls.trim()) {
                this.criticalSelectors.add(`.${cls.trim()}`);
              }
            });
          }
          
          // Add element's tag as critical selector
          this.criticalSelectors.add(element.tagName.toLowerCase());
        }
      });
      
      console.log(`🎯 Detected ${this.aboveFoldElements.size} above-fold elements`);
    };

    // Run detection after initial render
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', detectElements);
    } else {
      detectElements();
    }
  }

  /**
   * Extract critical CSS from stylesheets
   */
  extractCriticalCSS() {
    const criticalCSS = [];
    
    // Get all stylesheets
    const stylesheets = Array.from(document.styleSheets);
    
    stylesheets.forEach(stylesheet => {
      try {
        const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
        
        rules.forEach(rule => {
          if (rule.type === CSSRule.STYLE_RULE) {
            const selectorText = rule.selectorText;
            
            // Check if rule matches critical selectors
            if (this.isCriticalSelector(selectorText)) {
              criticalCSS.push(rule.cssText);
            }
          } else if (rule.type === CSSRule.MEDIA_RULE) {
            // Handle media queries
            const mediaText = rule.media.mediaText;
            if (this.isCriticalMedia(mediaText)) {
              Array.from(rule.cssRules).forEach(mediaRule => {
                if (this.isCriticalSelector(mediaRule.selectorText)) {
                  criticalCSS.push(`@media ${mediaText} { ${mediaRule.cssText} }`);
                }
              });
            }
          }
        });
      } catch (e) {
        // Cross-origin stylesheet access may be blocked
        console.warn('Cannot access stylesheet:', stylesheet.href);
      }
    });
    
    this.criticalCSS = criticalCSS.join('\n');
    console.log(`📝 Extracted ${criticalCSS.length} critical CSS rules`);
    
    return this.criticalCSS;
  }

  /**
   * Check if selector is critical for above-fold rendering
   */
  isCriticalSelector(selectorText) {
    if (!selectorText) return false;
    
    // Check against known critical selectors
    for (const criticalSelector of this.criticalSelectors) {
      if (selectorText.includes(criticalSelector)) {
        return true;
      }
    }
    
    // Check for utility classes that are likely critical
    const criticalPatterns = [
      /^\.container/, /^\.row/, /^\.col-/,
      /^\.flex/, /^\.grid/, /^\.block/,
      /^\.text-/, /^\.bg-/, /^\.border-/,
      /^\.p-/, /^\.m-/, /^\.pt-/, /^\.pb-/, /^\.pl-/, /^\.pr-/,
      /^\.w-/, /^\.h-/, /^\.max-w/, /^\.min-h/,
      /^\.font-/, /^\.text-/,
      /^\.btn/, /^\.button/,
      /^\.nav/, /^\.header/, /^\.footer/
    ];
    
    return criticalPatterns.some(pattern => pattern.test(selectorText));
  }

  /**
   * Check if media query is critical
   */
  isCriticalMedia(mediaText) {
    // Include mobile-first and common breakpoints
    const criticalMediaQueries = [
      'screen',
      'min-width: 768px',
      'max-width: 767px',
      'min-width: 1024px',
      'prefers-reduced-motion'
    ];
    
    return criticalMediaQueries.some(query => mediaText.includes(query));
  }

  /**
   * Inline critical CSS in document head
   */
  inlineCriticalCSS() {
    const criticalCSS = this.extractCriticalCSS();
    
    if (!criticalCSS) return;
    
    // Create style element for critical CSS
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-critical', 'true');
    styleElement.innerHTML = criticalCSS;
    
    // Insert before other stylesheets
    const firstLink = document.querySelector('link[rel="stylesheet"]');
    if (firstLink) {
      firstLink.parentNode.insertBefore(styleElement, firstLink);
    } else {
      document.head.appendChild(styleElement);
    }
    
    console.log('💉 Critical CSS inlined');
  }

  /**
   * Defer non-critical CSS loading
   */
  deferNonCriticalCSS() {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    
    stylesheets.forEach(link => {
      // Skip already processed or critical stylesheets
      if (link.dataset.defer === 'true' || link.dataset.critical === 'true') {
        return;
      }
      
      // Create preload link
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = link.href;
      preloadLink.onload = () => {
        // Convert to stylesheet when loaded
        preloadLink.rel = 'stylesheet';
      };
      
      // Replace original link
      link.parentNode.insertBefore(preloadLink, link);
      link.remove();
      
      console.log(`⏳ Deferred CSS: ${link.href}`);
    });
  }

  /**
   * Generate critical CSS for specific page type
   */
  generatePageSpecificCSS(pageType) {
    const pageSpecificSelectors = {
      home: ['.hero', '.featured-products', '.categories-grid'],
      product: ['.product-detail', '.product-images', '.product-info'],
      cart: ['.cart-items', '.cart-summary', '.checkout-btn'],
      checkout: ['.checkout-form', '.payment-methods', '.order-summary']
    };
    
    const selectors = pageSpecificSelectors[pageType] || [];
    selectors.forEach(selector => {
      this.criticalSelectors.add(selector);
    });
    
    console.log(`🎯 Added ${selectors.length} ${pageType}-specific critical selectors`);
  }

  /**
   * Optimize fonts loading for critical text
   */
  optimizeCriticalFonts() {
    // Preload critical fonts
    const criticalFonts = [
      '/fonts/inter-regular.woff2',
      '/fonts/inter-semibold.woff2'
    ];
    
    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = fontUrl;
      
      document.head.appendChild(link);
    });
    
    // Add font-display: swap to existing font faces
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    console.log('🔤 Critical fonts optimized');
  }

  /**
   * Monitor critical CSS performance
   */
  monitorCriticalCSS() {
    // Measure first contentful paint
    if ('performance' in window && 'getEntriesByType' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcp) {
        console.log(`🎨 First Contentful Paint: ${fcp.startTime.toFixed(2)}ms`);
        
        // Track with global performance monitor
        if (window.performanceMonitor) {
          window.performanceMonitor.trackCustomMetric('firstContentfulPaint', fcp.startTime);
        }
      }
    }
    
    // Monitor layout shifts
    if ('LayoutShift' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log(`📏 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
      });
      
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
  }

  /**
   * Get critical CSS optimization report
   */
  getOptimizationReport() {
    return {
      criticalSelectorsCount: this.criticalSelectors.size,
      aboveFoldElementsCount: this.aboveFoldElements.size,
      criticalCSSLength: this.criticalCSS.length,
      inlinedCSS: !!document.querySelector('style[data-critical="true"]'),
      deferredStylesheets: document.querySelectorAll('link[rel="preload"][as="style"]').length
    };
  }

  /**
   * Auto-optimize page for critical CSS
   */
  autoOptimize(pageType = 'home') {
    // Generate page-specific critical CSS
    this.generatePageSpecificCSS(pageType);
    
    // Inline critical CSS
    this.inlineCriticalCSS();
    
    // Defer non-critical CSS
    this.deferNonCriticalCSS();
    
    // Optimize fonts
    this.optimizeCriticalFonts();
    
    // Start monitoring
    this.monitorCriticalCSS();
    
    console.log(`🚀 Auto-optimization completed for ${pageType} page`);
  }
}

// Create and export singleton instance
const criticalCSSManager = new CriticalCSSManager();

// Auto-optimize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Detect page type from URL
    const path = window.location.pathname;
    let pageType = 'home';
    
    if (path.includes('/product')) pageType = 'product';
    else if (path.includes('/cart')) pageType = 'cart';
    else if (path.includes('/checkout')) pageType = 'checkout';
    
    criticalCSSManager.autoOptimize(pageType);
  });
} else {
  criticalCSSManager.autoOptimize();
}

export { criticalCSSManager };
export default CriticalCSSManager;
