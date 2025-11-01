import { saveUserCart, saveUserWishlist } from '../../utils/userDataSync';

/**
 * Redux middleware to auto-save cart and wishlist to Firebase
 * when user is authenticated (CUSTOMERS ONLY, NOT ADMINS)
 */
export const userDataSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Get current state after action
  const state = store.getState();
  const { isAuthenticated, user } = state.auth;
  
  // Only sync if user is authenticated AND is a customer (not admin)
  if (isAuthenticated && user && user.role !== 'admin') {
    // Cart actions that should trigger save
    const cartActions = [
      'cart/addToCart',
      'cart/removeFromCart',
      'cart/updateQuantity',
      'cart/clearCart'
    ];
    
    // Wishlist actions that should trigger save
    const wishlistActions = [
      'wishlist/addToWishlist',
      'wishlist/removeFromWishlist',
      'wishlist/clearWishlist'
    ];
    
    // Save cart to Firebase after cart actions
    if (cartActions.includes(action.type)) {
      const cartData = { items: state.cart.items };
      saveUserCart(user.uid, cartData).catch(err => {
        console.error('Failed to sync cart to Firebase:', err);
      });
    }
    
    // Save wishlist to Firebase after wishlist actions
    if (wishlistActions.includes(action.type)) {
      const wishlistData = { items: state.wishlist.items };
      saveUserWishlist(user.uid, wishlistData).catch(err => {
        console.error('Failed to sync wishlist to Firebase:', err);
      });
    }
  }
  
  return result;
};
