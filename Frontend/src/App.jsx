import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import { checkAuth } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// UI Components
import SplashScreen from './components/ui/SplashScreen';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Core Pages (keep eagerly loaded for better UX)
import Home from './components/pages/Home3D';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Collections from './pages/Collections';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// Lazy-loaded components
import {
  LazyAdminDashboard,
  LazyAdminProducts,
  LazyAdminOrders,
  LazyAdminUsers,
  LazyAdminAnalytics,
  LazyAdminSettings,
  LazyOrderDetail,
  LazyProfile,
  LazyCheckout,
  LazyOrderSuccess,
  LazyWrapper
} from './utils/lazyRoutes';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const isAdminRoute = location.pathname.startsWith('/admin');
  // const [showSplash, setShowSplash] = useState(true); // DISABLED - causing React errors

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Fetch user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated, user]);
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // // Handle splash screen completion
  // const handleSplashComplete = () => {
  //   setShowSplash(false);
  // };

  // // Show splash screen first
  // if (showSplash) {
  //   return <SplashScreen onComplete={handleSplashComplete} />;
  // }

  if (isAdminRoute) {
    return (
      <AdminLayout>        <Routes>
          {/* Admin Routes - Lazy Loaded */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminDashboard />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminDashboard />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminProducts />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminOrders />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders/:id" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyOrderDetail />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminUsers />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminAnalytics />
              </LazyWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute adminOnly={true}>
              <LazyWrapper>
                <LazyAdminSettings />
              </LazyWrapper>
            </ProtectedRoute>
          } />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />      <main className="flex-grow">
        <ErrorBoundary>          <Routes>          {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - Lazy Loaded */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <LazyWrapper>
                  <LazyCheckout />
                </LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <LazyWrapper>
                  <LazyProfile />
                </LazyWrapper>
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute>
                <LazyWrapper>
                  <LazyOrderSuccess />
                </LazyWrapper>
              </ProtectedRoute>
            } />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
