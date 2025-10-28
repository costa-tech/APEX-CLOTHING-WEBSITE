// Lazy-loaded route components for code splitting
import React, { lazy } from 'react';
import { bundleAnalyzer } from './bundleAnalysis';

// Enhanced lazy loading with bundle tracking
const createTrackedLazy = (importFunc, componentName) => {
  return lazy(() => {
    const startTime = performance.now();
    return bundleAnalyzer.trackChunkLoad(
      componentName,
      importFunc().then(module => {
        bundleAnalyzer.trackComponentLoad(componentName, startTime);
        return module;
      })
    );
  });
};

// Lazy load heavy components that aren't immediately needed
export const LazyAdminDashboard = createTrackedLazy(
  () => import('../pages/admin/AdminDashboard'),
  'AdminDashboard'
);
export const LazyAdminProducts = createTrackedLazy(
  () => import('../pages/admin/AdminProducts'),
  'AdminProducts'
);
export const LazyAdminOrders = createTrackedLazy(
  () => import('../pages/admin/AdminOrders'),
  'AdminOrders'
);
export const LazyAdminUsers = createTrackedLazy(
  () => import('../pages/admin/AdminUsers'),
  'AdminUsers'
);
export const LazyAdminAnalytics = createTrackedLazy(
  () => import('../pages/admin/AdminAnalytics'),
  'AdminAnalytics'
);
export const LazyAdminSettings = createTrackedLazy(
  () => import('../pages/admin/AdminSettings'),
  'AdminSettings'
);
export const LazyOrderDetail = createTrackedLazy(
  () => import('../pages/admin/OrderDetail'),
  'OrderDetail'
);

// Lazy load non-critical pages
export const LazyProfile = createTrackedLazy(
  () => import('../pages/Profile'),
  'Profile'
);
export const LazyCheckout = createTrackedLazy(
  () => import('../pages/Checkout'),
  'Checkout'
);
export const LazyOrderSuccess = createTrackedLazy(
  () => import('../pages/OrderSuccess'),
  'OrderSuccess'
);

// Enhanced lazy loading error boundary wrapper with analytics
export const LazyWrapper = ({ children, fallback = null, componentName = 'Unknown' }) => {
  React.useEffect(() => {
    bundleAnalyzer.recordMemorySnapshot(`LazyWrapper-${componentName}-mounted`);
  }, [componentName]);

  const defaultFallback = React.createElement('div', 
    { className: "min-h-screen flex items-center justify-center" },
    React.createElement('div', 
      { className: "text-center" },
      React.createElement('div', { 
        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" 
      }),
      React.createElement('p', 
        { className: "text-gray-600" }, 
        `Loading ${componentName}...`
      ),
      React.createElement('p', 
        { className: "text-xs text-gray-400 mt-2" }, 
        "Optimizing for better performance"
      )
    )
  );

  return React.createElement(React.Suspense, 
    { fallback: fallback || defaultFallback },
    children
  );
};
