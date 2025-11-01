import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get local cart from localStorage
 */
export const getLocalCart = () => {
  try {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [] };
  } catch (error) {
    console.error('Error reading local cart:', error);
    return { items: [] };
  }
};

/**
 * Get local wishlist from localStorage
 */
export const getLocalWishlist = () => {
  try {
    const wishlistData = localStorage.getItem('wishlist');
    return wishlistData ? JSON.parse(wishlistData) : { items: [] };
  } catch (error) {
    console.error('Error reading local wishlist:', error);
    return { items: [] };
  }
};

/**
 * Save cart to localStorage
 */
export const saveLocalCart = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving local cart:', error);
  }
};

/**
 * Save wishlist to localStorage
 */
export const saveLocalWishlist = (wishlist) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving local wishlist:', error);
  }
};

/**
 * Clear local cart and wishlist
 */
export const clearLocalData = () => {
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
};

/**
 * Merge two cart/wishlist arrays, avoiding duplicates
 */
const mergeItems = (localItems = [], userItems = []) => {
  const merged = [...userItems];
  
  localItems.forEach(localItem => {
    // Check if item already exists (by id, size, and color for cart)
    const exists = merged.find(item => {
      if (localItem.size && localItem.color) {
        // Cart item comparison
        return item.id === localItem.id && 
               item.size === localItem.size && 
               item.color === localItem.color;
      } else {
        // Wishlist item comparison (just id)
        return item.id === localItem.id;
      }
    });
    
    if (exists) {
      // If item exists in cart, increase quantity
      if (localItem.quantity && exists.quantity) {
        exists.quantity += localItem.quantity;
      }
    } else {
      // Add new item
      merged.push(localItem);
    }
  });
  
  return merged;
};

/**
 * Sync local cart and wishlist to user's Firestore profile
 * NOTE: Should only be called for customer accounts, not admins
 */
export const syncLocalToUserProfile = async (userId) => {
  try {
    console.log('🔄 Syncing local data to user profile:', userId);
    
    // Get local data
    const localCart = getLocalCart();
    const localWishlist = getLocalWishlist();
    
    // Get user document from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Safety check: Don't sync for admin users
      if (userData.role === 'admin') {
        console.log('🔐 Admin user detected, skipping cart/wishlist sync');
        clearLocalData();
        return {
          cart: { items: [] },
          wishlist: { items: [] }
        };
      }
      
      // Merge local data with existing user data
      const mergedCart = {
        items: mergeItems(localCart.items || [], userData.cart?.items || [])
      };
      
      const mergedWishlist = {
        items: mergeItems(localWishlist.items || [], userData.wishlist?.items || [])
      };
      
      // Update user document with merged data
      await updateDoc(userDocRef, {
        cart: mergedCart,
        wishlist: mergedWishlist,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Synced to Firebase:', {
        cartItems: mergedCart.items.length,
        wishlistItems: mergedWishlist.items.length
      });
      
      // Clear local storage after successful sync
      clearLocalData();
      
      return {
        cart: mergedCart,
        wishlist: mergedWishlist
      };
    } else {
      // User document doesn't exist, create it with local data
      await setDoc(userDocRef, {
        cart: localCart,
        wishlist: localWishlist,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      console.log('✅ Created user profile with local data');
      
      // Clear local storage after successful sync
      clearLocalData();
      
      return {
        cart: localCart,
        wishlist: localWishlist
      };
    }
  } catch (error) {
    console.error('❌ Error syncing local data to user profile:', error);
    throw error;
  }
};

/**
 * Load user's cart and wishlist from Firestore
 */
export const loadUserData = async (userId) => {
  try {
    console.log('📥 Loading user data from Firebase:', userId);
    
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        cart: userData.cart || { items: [] },
        wishlist: userData.wishlist || { items: [] }
      };
    }
    
    return {
      cart: { items: [] },
      wishlist: { items: [] }
    };
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    return {
      cart: { items: [] },
      wishlist: { items: [] }
    };
  }
};

/**
 * Save user's cart to Firestore
 */
export const saveUserCart = async (userId, cart) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      cart: cart,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Cart saved to Firebase');
  } catch (error) {
    console.error('❌ Error saving cart to Firebase:', error);
    // Fallback to localStorage if Firebase fails
    saveLocalCart(cart);
  }
};

/**
 * Save user's wishlist to Firestore
 */
export const saveUserWishlist = async (userId, wishlist) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      wishlist: wishlist,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Wishlist saved to Firebase');
  } catch (error) {
    console.error('❌ Error saving wishlist to Firebase:', error);
    // Fallback to localStorage if Firebase fails
    saveLocalWishlist(wishlist);
  }
};
