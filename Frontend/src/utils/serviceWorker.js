/**
 * Service Worker Registration and Management
 * Handles PWA functionality, caching, and offline support
 */
import React from 'react';

class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isOnline = navigator.onLine;
    this.updateAvailable = false;
    this.listeners = new Map();
    
    this.init();
  }

  /**
   * Initialize service worker
   */
  async init() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await // navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        this.setupEventListeners();
        this.checkForUpdates();
        
        // Listen for online/offline changes
        window.addEventListener('online', () => this.handleOnlineChange(true));
        window.addEventListener('offline', () => this.handleOnlineChange(false));
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.log('Service Worker not supported');
    }
  }

  /**
   * Setup service worker event listeners
   */
  setupEventListeners() {
    if (!this.registration) return;

    // Listen for waiting service worker
    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.updateAvailable = true;
            this.emit('updateAvailable', newWorker);
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event.data);
    });
  }

  /**
   * Check for service worker updates
   */
  async checkForUpdates() {
    if (this.registration) {
      try {
        await this.registration.update();
      } catch (error) {
        console.error('Failed to check for service worker updates:', error);
      }
    }
  }

  /**
   * Activate waiting service worker
   */
  async activateUpdate() {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  /**
   * Handle online/offline status changes
   */
  handleOnlineChange(online) {
    this.isOnline = online;
    this.emit('onlineStatusChange', { online });
    
    if (online) {
      console.log('App is back online');
      // Sync any pending offline data
      this.syncOfflineData();
    } else {
      console.log('App is offline');
    }
  }

  /**
   * Handle messages from service worker
   */
  handleServiceWorkerMessage(data) {
    switch (data.type) {
      case 'CACHE_UPDATED':
        this.emit('cacheUpdated', data);
        break;
      case 'OFFLINE_READY':
        this.emit('offlineReady', data);
        break;
      default:
        console.log('Unknown service worker message:', data);
    }
  }

  /**
   * Get cache status
   */
  async getCacheStatus() {
    if (!navigator.serviceWorker.controller) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Clear all caches
   */
  async clearCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
      this.emit('cachesCleared');
    }
  }

  /**
   * Sync offline data when back online
   */
  async syncOfflineData() {
    // This would typically sync any data stored while offline
    // Implementation depends on your offline strategy
    console.log('Syncing offline data...');
    this.emit('offlineDataSynced');
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(urls) {
    if ('caches' in window) {
      const cache = await caches.open('critical-resources');
      
      try {
        await cache.addAll(urls);
        console.log('Critical resources preloaded');
      } catch (error) {
        console.error('Failed to preload critical resources:', error);
      }
    }
  }

  /**
   * Event emitter functionality
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * Get service worker status
   */
  getStatus() {
    return {
      isSupported: 'serviceWorker' in navigator,
      isRegistered: !!this.registration,
      isOnline: this.isOnline,
      updateAvailable: this.updateAvailable,
      controller: !!navigator.serviceWorker.controller
    };
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();

/**
 * React hook for service worker functionality
 */
export const useServiceWorker = () => {
  const [status, setStatus] = React.useState(serviceWorkerManager.getStatus());
  const [cacheStatus, setCacheStatus] = React.useState(null);

  React.useEffect(() => {
    const updateStatus = () => setStatus(serviceWorkerManager.getStatus());
    
    serviceWorkerManager.on('updateAvailable', updateStatus);
    serviceWorkerManager.on('onlineStatusChange', updateStatus);
    serviceWorkerManager.on('cachesCleared', updateStatus);
    
    // Get initial cache status
    serviceWorkerManager.getCacheStatus().then(setCacheStatus);

    return () => {
      serviceWorkerManager.off('updateAvailable', updateStatus);
      serviceWorkerManager.off('onlineStatusChange', updateStatus);
      serviceWorkerManager.off('cachesCleared', updateStatus);
    };
  }, []);

  return {
    status,
    cacheStatus,
    activateUpdate: serviceWorkerManager.activateUpdate.bind(serviceWorkerManager),
    clearCaches: serviceWorkerManager.clearCaches.bind(serviceWorkerManager),
    checkForUpdates: serviceWorkerManager.checkForUpdates.bind(serviceWorkerManager),
    preloadResources: serviceWorkerManager.preloadCriticalResources.bind(serviceWorkerManager)
  };
};

export default serviceWorkerManager;
