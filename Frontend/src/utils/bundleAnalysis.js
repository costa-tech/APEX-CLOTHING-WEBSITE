/**
 * Bundle Analysis Utility
 * Provides runtime insights into component loading and performance
 */
import React from 'react';

class BundleAnalyzer {
  constructor() {
    this.componentLoadTimes = new Map();
    this.chunkLoadTimes = new Map();
    this.memoryUsage = [];
    this.isAnalyzing = process.env.NODE_ENV === 'development';
  }

  /**
   * Track component load time
   */
  trackComponentLoad(componentName, startTime = performance.now()) {
    if (!this.isAnalyzing) return;

    const endTime = performance.now();
    const loadTime = endTime - startTime;
    
    this.componentLoadTimes.set(componentName, {
      loadTime,
      timestamp: new Date().toISOString(),
      memoryUsed: this.getCurrentMemoryUsage()
    });

    console.log(`🚀 Component loaded: ${componentName} (${loadTime.toFixed(2)}ms)`);
  }

  /**
   * Track lazy chunk loading
   */
  trackChunkLoad(chunkName, promise) {
    if (!this.isAnalyzing) return promise;

    const startTime = performance.now();
    
    return promise.then(result => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.chunkLoadTimes.set(chunkName, {
        loadTime,
        timestamp: new Date().toISOString(),
        success: true
      });

      console.log(`📦 Chunk loaded: ${chunkName} (${loadTime.toFixed(2)}ms)`);
      return result;
    }).catch(error => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      this.chunkLoadTimes.set(chunkName, {
        loadTime,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });

      console.error(`❌ Chunk failed: ${chunkName} (${loadTime.toFixed(2)}ms)`, error);
      throw error;
    });
  }

  /**
   * Get current memory usage (if available)
   */
  getCurrentMemoryUsage() {
    if ('memory' in performance) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  /**
   * Record memory snapshot
   */
  recordMemorySnapshot(label = 'snapshot') {
    if (!this.isAnalyzing) return;

    const memory = this.getCurrentMemoryUsage();
    if (memory) {
      this.memoryUsage.push({
        label,
        memory,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    return {
      componentLoadTimes: Object.fromEntries(this.componentLoadTimes),
      chunkLoadTimes: Object.fromEntries(this.chunkLoadTimes),
      memoryUsage: this.memoryUsage,
      summary: this.generateSummary()
    };
  }

  /**
   * Generate performance summary
   */
  generateSummary() {
    const componentTimes = Array.from(this.componentLoadTimes.values());
    const chunkTimes = Array.from(this.chunkLoadTimes.values());

    return {
      totalComponents: componentTimes.length,
      totalChunks: chunkTimes.length,
      averageComponentLoadTime: componentTimes.length > 0 
        ? componentTimes.reduce((sum, item) => sum + item.loadTime, 0) / componentTimes.length
        : 0,
      averageChunkLoadTime: chunkTimes.length > 0
        ? chunkTimes.reduce((sum, item) => sum + item.loadTime, 0) / chunkTimes.length
        : 0,
      slowestComponent: componentTimes.length > 0
        ? Array.from(this.componentLoadTimes.entries())
            .sort(([,a], [,b]) => b.loadTime - a.loadTime)[0]
        : null,
      slowestChunk: chunkTimes.length > 0
        ? Array.from(this.chunkLoadTimes.entries())
            .sort(([,a], [,b]) => b.loadTime - a.loadTime)[0]
        : null,
      currentMemory: this.getCurrentMemoryUsage()
    };
  }

  /**
   * Print performance report to console
   */
  printReport() {
    if (!this.isAnalyzing) return;

    const report = this.getPerformanceReport();
    console.group('📊 Bundle Performance Report');
    
    console.log('📈 Summary:', report.summary);
    
    if (report.summary.slowestComponent) {
      console.log('🐌 Slowest Component:', report.summary.slowestComponent);
    }
    
    if (report.summary.slowestChunk) {
      console.log('🐌 Slowest Chunk:', report.summary.slowestChunk);
    }
    
    if (report.summary.currentMemory) {
      console.log('🧠 Memory Usage:', report.summary.currentMemory);
    }
    
    console.groupEnd();
  }

  /**
   * Export data for external analysis
   */
  exportData() {
    const report = this.getPerformanceReport();
    const dataStr = JSON.stringify(report, null, 2);
    
    // Create download link
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bundle-analysis-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all collected data
   */
  clear() {
    this.componentLoadTimes.clear();
    this.chunkLoadTimes.clear();
    this.memoryUsage = [];
    console.log('🧹 Bundle analysis data cleared');
  }
}

// Create singleton instance
export const bundleAnalyzer = new BundleAnalyzer();

/**
 * Higher-order component to track component loading
 */
export const withBundleTracking = (Component, componentName) => {
  const TrackedComponent = (props) => {
    React.useEffect(() => {
      bundleAnalyzer.trackComponentLoad(componentName || Component.name);
    }, []);

    return React.createElement(Component, props);
  };

  TrackedComponent.displayName = `withBundleTracking(${componentName || Component.name})`;
  return TrackedComponent;
};

/**
 * Hook to access bundle analyzer
 */
export const useBundleAnalyzer = () => {
  return {
    analyzer: bundleAnalyzer,
    trackComponent: bundleAnalyzer.trackComponentLoad.bind(bundleAnalyzer),
    recordMemory: bundleAnalyzer.recordMemorySnapshot.bind(bundleAnalyzer),
    getReport: bundleAnalyzer.getPerformanceReport.bind(bundleAnalyzer),
    printReport: bundleAnalyzer.printReport.bind(bundleAnalyzer),
    exportData: bundleAnalyzer.exportData.bind(bundleAnalyzer)
  };
};

export default bundleAnalyzer;
