// Performance monitoring utility for React applications
import React, { useEffect, memo } from 'react';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      renders: [],
      errors: []
    };
    this.isEnabled = process.env.NODE_ENV === 'development';
  }

  // Track page load performance
  trackPageLoad(pageName) {
    if (!this.isEnabled) return;
    
    const perfEntry = performance.getEntriesByType('navigation')[0];
    if (perfEntry) {
      const metrics = {
        page: pageName,
        loadTime: perfEntry.loadEventEnd - perfEntry.loadEventStart,
        domContentLoaded: perfEntry.domContentLoadedEventEnd - perfEntry.domContentLoadedEventStart,
        firstPaint: this.getFirstPaint(),
        timestamp: Date.now()
      };
      
      this.metrics.pageLoads.push(metrics);
      console.log(`📊 Page Load Metrics for ${pageName}:`, metrics);
    }
  }

  // Track API call performance
  trackApiCall(endpoint, duration, success = true) {
    if (!this.isEnabled) return;
    
    const metrics = {
      endpoint,
      duration,
      success,
      timestamp: Date.now()
    };
    
    this.metrics.apiCalls.push(metrics);
    
    const status = success ? '✅' : '❌';
    const color = duration > 1000 ? 'color: orange' : 'color: green';
    console.log(`🌐 API Call ${status} ${endpoint}:`, `%c${duration}ms`, color);
  }

  // Track component render performance
  trackRender(componentName, renderTime) {
    if (!this.isEnabled) return;
    
    const metrics = {
      component: componentName,
      renderTime,
      timestamp: Date.now()
    };
    
    this.metrics.renders.push(metrics);
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`⚠️  Slow render detected in ${componentName}: ${renderTime}ms`);
    }
  }

  // Track errors
  trackError(error, component) {
    if (!this.isEnabled) return;
    
    const errorMetrics = {
      message: error.message,
      stack: error.stack,
      component,
      timestamp: Date.now()
    };
    
    this.metrics.errors.push(errorMetrics);
    console.error(`💥 Error in ${component}:`, error);
  }

  // Get first paint timing
  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : null;
  }

  // Get performance summary
  getSummary() {
    if (!this.isEnabled) return null;
    
    const avgPageLoad = this.metrics.pageLoads.length > 0 
      ? this.metrics.pageLoads.reduce((acc, curr) => acc + curr.loadTime, 0) / this.metrics.pageLoads.length
      : 0;
    
    const avgApiCall = this.metrics.apiCalls.length > 0
      ? this.metrics.apiCalls.reduce((acc, curr) => acc + curr.duration, 0) / this.metrics.apiCalls.length
      : 0;
    
    const slowRenders = this.metrics.renders.filter(render => render.renderTime > 16).length;
    
    return {
      pageLoads: this.metrics.pageLoads.length,
      avgPageLoadTime: avgPageLoad,
      apiCalls: this.metrics.apiCalls.length,
      avgApiCallTime: avgApiCall,
      totalRenders: this.metrics.renders.length,
      slowRenders,
      errors: this.metrics.errors.length
    };
  }

  // Clear metrics
  clear() {
    this.metrics = {
      pageLoads: [],
      apiCalls: [],
      renders: [],
      errors: []
    };
    console.log('🧹 Performance metrics cleared');
  }

  // Log summary to console
  logSummary() {
    if (!this.isEnabled) return;
    
    const summary = this.getSummary();
    console.group('📊 Performance Summary');
    console.table(summary);
    console.groupEnd();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// React Hook for tracking component renders
export const usePerformanceTracker = (componentName) => {
  const startTime = performance.now();
  
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    performanceMonitor.trackRender(componentName, renderTime);
  });
};

// Higher-order component for automatic performance tracking
export const withPerformanceTracking = (WrappedComponent) => {
  // Return a function component that tracks performance
  const PerformanceTrackedComponent = (props) => {
    const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    usePerformanceTracker(componentName);
    
    // Use React.createElement instead of JSX to avoid compilation issues
    return React.createElement(WrappedComponent, props);
  };
  
  return memo(PerformanceTrackedComponent);
};

export default performanceMonitor;
