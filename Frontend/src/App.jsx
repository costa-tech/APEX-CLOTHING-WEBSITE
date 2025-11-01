import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';
import { checkAuth } from './store/slices/authSlice';
import { loadLocalCart, loadUserCart } from './store/slices/cartSlice';
import { loadLocalWishlist, loadUserWishlist } from './store/slices/wishlistSlice';
import { syncLocalToUserProfile } from './utils/userDataSync';

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
import SubcategoryProducts from './pages/SubcategoryProducts';
import About from './pages/About';
import Wishlist from './pages/Wishlist';

// Footer Pages
import ContactUs from './pages/ContactUs';
import SizeGuide from './pages/SizeGuide';
import ShippingInfo from './pages/ShippingInfo';
import Returns from './pages/Returns';
import FAQ from './pages/FAQ';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Sustainability from './pages/Sustainability';
import Investors from './pages/Investors';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import Accessibility from './pages/Accessibility';

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
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [authChecked, setAuthChecked] = useState(false);
  const [dataSynced, setDataSynced] = useState(false);

  // Load local cart/wishlist on app init (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(loadLocalCart());
      dispatch(loadLocalWishlist());
      console.log('👤 Guest mode: Loaded local cart and wishlist');
    }
  }, [dispatch, isAuthenticated]);

  // Check auth on mount
  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      setAuthChecked(true);
    });
  }, [dispatch]);

  // Sync local data to user profile when user logs in (CUSTOMERS ONLY, NOT ADMINS)
  useEffect(() => {
    const syncUserData = async () => {
      if (isAuthenticated && user && !dataSynced) {
        // Skip sync for admin users - admins don't need cart/wishlist
        if (user.role === 'admin') {
          console.log('🔐 Admin user detected, skipping cart/wishlist sync');
          setDataSynced(true);
          return;
        }
        
        try {
          console.log('🔄 Customer authenticated, syncing data...');
          
          // Sync local cart/wishlist to Firebase and get merged data
          const syncedData = await syncLocalToUserProfile(user.uid);
          
          // Load the merged data into Redux
          dispatch(loadUserCart(syncedData.cart));
          dispatch(loadUserWishlist(syncedData.wishlist));
          
          setDataSynced(true);
          console.log('✅ Customer data synced successfully');
        } catch (error) {
          console.error('❌ Error syncing user data:', error);
          // Fallback: just load local data
          dispatch(loadLocalCart());
          dispatch(loadLocalWishlist());
        }
      }
    };
    
    syncUserData();
  }, [dispatch, isAuthenticated, user, dataSynced]);
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading spinner while checking auth
  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navbar />      <main className="flex-grow">
        <ErrorBoundary>          <Routes>          {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:category/:subcategory" element={<SubcategoryProducts />} />
            <Route path="/collections/:category" element={<Collections />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Footer Pages - Help */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/faq" element={<FAQ />} />
            
            {/* Footer Pages - Company */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/investors" element={<Investors />} />
            
            {/* Footer Pages - Legal */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/accessibility" element={<Accessibility />} />
            
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
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
