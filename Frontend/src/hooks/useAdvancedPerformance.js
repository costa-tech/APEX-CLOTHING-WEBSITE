// Enhanced performance utilities for advanced optimizations
import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

/**
 * Advanced debounce hook with immediate option
 */
export const useAdvancedDebounce = (callback, delay, immediate = false) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef();

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args) => {
    const executeCallback = () => callbackRef.current(...args);

    if (immediate && !timeoutRef.current) {
      executeCallback();
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = undefined;
      if (!immediate) {
        executeCallback();
      }
    }, delay);
  }, [delay, immediate]);
};

/**
 * Throttle hook for performance-critical operations
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef();

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - (Date.now() - lastRun.current));
    }
  }, [callback, delay]);
};

/**
 * Intersection Observer hook for viewport detection
 */
export const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { elementRef, isIntersecting, hasIntersected };
};

/**
 * Virtual scrolling hook for large lists
 */
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);

    return {
      start,
      end,
      items: items.slice(start, end),
      totalHeight: items.length * itemHeight,
      offsetY: start * itemHeight
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

/**
 * Image preloader hook
 */
export const useImagePreloader = (imageUrls = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = useCallback(async (urls) => {
    setIsLoading(true);
    const imagePromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(url));
          resolve(url);
        };
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      await Promise.all(imagePromises);
    } catch (error) {
      console.warn('Some images failed to preload:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imageUrls.length > 0) {
      preloadImages(imageUrls);
    }
  }, [imageUrls, preloadImages]);

  return { loadedImages, isLoading, preloadImages };
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMetrics = (componentName) => {
  const renderStart = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - renderStart.current;
    
    if (renderTime > 16) { // More than one frame
      console.warn(`🐌 Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    if (renderCount.current % 10 === 0) {
      console.log(`📊 ${componentName} rendered ${renderCount.current} times`);
    }

    renderStart.current = performance.now();
  });

  return { renderCount: renderCount.current };
};

/**
 * Local storage with expiration hook
 */
export const useLocalStorageWithExpiry = (key, defaultValue, expiryHours = 24) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);
      const now = new Date();

      if (now.getTime() > parsedItem.expiry) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValueWithExpiry = useCallback((newValue) => {
    try {
      const now = new Date();
      const expiryTime = now.getTime() + (expiryHours * 60 * 60 * 1000);
      
      const item = {
        value: newValue,
        expiry: expiryTime
      };

      localStorage.setItem(key, JSON.stringify(item));
      setValue(newValue);
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, expiryHours]);

  return [value, setValueWithExpiry];
};

/**
 * Network status hook
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect connection speed
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionSpeed(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionSpeed(connection.effectiveType || 'unknown');
      };

      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionSpeed };
};
