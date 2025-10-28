/**
 * Resource Hints Utility
 * Implements preload, prefetch, and preconnect for critical resources
 */

class ResourceHintsManager {
  constructor() {
    this.preloadedResources = new Set();
    this.prefetchedRoutes = new Set();
    this.connectedOrigins = new Set();
    
    // Initialize critical resource hints
    this.initializeCriticalHints();
  }

  /**
   * Initialize critical resource hints
   */
  initializeCriticalHints() {
    // Preconnect to API origin
    this.preconnect('http://localhost:5000', 'API connection');
    
    // Prefetch critical routes that users commonly visit
    this.prefetchRoute('/products', 'Products page');
    this.prefetchRoute('/cart', 'Cart page');
    
    // Preload critical fonts and assets
    this.preloadFont('/fonts/inter.woff2', 'Inter font');
    
    console.log('🔗 Resource hints initialized');
  }

  /**
   * Preconnect to external origins
   */
  preconnect(origin, description = '') {
    if (this.connectedOrigins.has(origin)) return;

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.connectedOrigins.add(origin);
    
    console.log(`🔗 Preconnected to ${origin}${description ? ` (${description})` : ''}`);
  }

  /**
   * Preload critical resources
   */
  preload(url, type = 'fetch', description = '') {
    if (this.preloadedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'fetch') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
    console.log(`📦 Preloaded ${url}${description ? ` (${description})` : ''}`);
  }

  /**
   * Preload fonts with proper attributes
   */
  preloadFont(url, description = '') {
    if (this.preloadedResources.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    
    document.head.appendChild(link);
    this.preloadedResources.add(url);
    
    console.log(`🔤 Preloaded font ${url}${description ? ` (${description})` : ''}`);
  }

  /**
   * Prefetch routes for future navigation
   */
  prefetchRoute(route, description = '') {
    if (this.prefetchedRoutes.has(route)) return;

    // Create prefetch link for the route's chunk
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    
    document.head.appendChild(link);
    this.prefetchedRoutes.add(route);
    
    console.log(`🚀 Prefetched route ${route}${description ? ` (${description})` : ''}`);
  }

  /**
   * Intelligent prefetching based on user behavior
   */
  intelligentPrefetch(currentRoute) {
    const prefetchMaps = {
      '/': ['/products', '/login'],
      '/products': ['/cart', '/wishlist'],
      '/product': ['/cart', '/checkout'],
      '/cart': ['/checkout', '/products'],
      '/login': ['/products', '/profile'],
      '/profile': ['/orders', '/settings']
    };

    const routesToPrefetch = prefetchMaps[currentRoute];
    if (routesToPrefetch) {
      routesToPrefetch.forEach(route => {
        this.prefetchRoute(route, `Intelligent prefetch from ${currentRoute}`);
      });
    }
  }

  /**
   * Preload API endpoints that are likely to be called
   */
  preloadAPI(endpoint, description = '') {
    const fullUrl = `http://localhost:5000${endpoint}`;
    this.preload(fullUrl, 'fetch', description);
  }

  /**
   * Smart resource loading based on connection type
   */
  adaptiveResourceLoading() {
    // Use Network Information API if available
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Adjust strategy based on connection quality
      if (connection.effectiveType === '4g' && !connection.saveData) {
        // Aggressive preloading on fast connections
        this.preloadAPI('/api/products/featured', 'Featured products');
        this.preloadAPI('/api/categories', 'Categories');
        console.log('🚀 Aggressive preloading enabled (4G connection)');
      } else if (connection.saveData) {
        // Minimal preloading on data saver mode
        console.log('💾 Minimal preloading (Data Saver enabled)');
        return;
      }
    }
  }

  /**
   * Monitor and report resource hint effectiveness
   */
  getResourceHintReport() {
    return {
      preconnectedOrigins: Array.from(this.connectedOrigins),
      preloadedResources: Array.from(this.preloadedResources),
      prefetchedRoutes: Array.from(this.prefetchedRoutes),
      networkInfo: this.getNetworkInfo()
    };
  }

  /**
   * Get network information for optimization decisions
   */
  getNetworkInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData
      };
    }
    return { supported: false };
  }

  /**
   * Clean up resource hints (for testing)
   */
  cleanup() {
    document.querySelectorAll('link[rel="preload"], link[rel="prefetch"], link[rel="preconnect"]')
      .forEach(link => {
        if (this.preloadedResources.has(link.href) || 
            this.prefetchedRoutes.has(link.href) || 
            this.connectedOrigins.has(link.href)) {
          link.remove();
        }
      });
    
    this.preloadedResources.clear();
    this.prefetchedRoutes.clear();
    this.connectedOrigins.clear();
  }
}

// Create and export singleton instance
const resourceHintsManager = new ResourceHintsManager();

// Monitor route changes for intelligent prefetching
let currentPath = window.location.pathname;
setInterval(() => {
  if (window.location.pathname !== currentPath) {
    const newPath = window.location.pathname;
    resourceHintsManager.intelligentPrefetch(newPath);
    currentPath = newPath;
  }
}, 1000);

export { resourceHintsManager };
export default ResourceHintsManager;
