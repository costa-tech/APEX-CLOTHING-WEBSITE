import { useDispatch, useSelector } from 'react-redux';
import { 
  addToCart as addToCartAction, 
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction
} from '../store/slices/cartSlice';
import { 
  addToWishlist as addToWishlistAction, 
  removeFromWishlist as removeFromWishlistAction,
  clearWishlist as clearWishlistAction
} from '../store/slices/wishlistSlice';

/**
 * Custom hook that wraps cart and wishlist actions with automatic userId injection
 * This ensures data is saved to Firebase for logged-in users and localStorage for guests
 */
export const useCartWishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const userId = user?.uid;

  // Cart actions with auto userId
  const addToCart = (payload) => {
    dispatch(addToCartAction({ ...payload, userId }));
  };

  const removeFromCart = (payload) => {
    dispatch(removeFromCartAction({ ...payload, userId }));
  };

  const updateQuantity = (payload) => {
    dispatch(updateQuantityAction({ ...payload, userId }));
  };

  const clearCart = () => {
    dispatch(clearCartAction({ userId }));
  };

  // Wishlist actions with auto userId
  const addToWishlist = (product) => {
    dispatch(addToWishlistAction({ product, userId }));
  };

  const removeFromWishlist = (productId) => {
    dispatch(removeFromWishlistAction({ productId, userId }));
  };

  const clearWishlist = () => {
    dispatch(clearWishlistAction({ userId }));
  };

  return {
    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Wishlist actions
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    
    // User info
    userId,
    isAuthenticated: !!user,
  };
};

export default useCartWishlist;
