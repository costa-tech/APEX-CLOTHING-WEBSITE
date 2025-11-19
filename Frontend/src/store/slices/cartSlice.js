import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as cartAPI from '../../utils/cartAPI';
import { 
  getLocalCart, 
  saveLocalCart, 
  saveUserCart,
  loadUserData,
  syncLocalToUserProfile 
} from '../../utils/userDataSync';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.cart;
    } catch (error) {
      // Silently fail if cart endpoint doesn't exist (404)
      if (error.response?.status === 404) {
        return rejectWithValue('cart_not_available');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(cartData);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart item');
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(itemId);
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  total: 0, // Alias for totalAmount for backward compatibility
  itemCount: 0, // Alias for totalQuantity
  isOpen: false,
  isLoading: false,
  error: null,
  synced: false, // Track if user data has been synced
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Load cart from localStorage on app init (for guests)
    loadLocalCart: (state) => {
      const localCart = getLocalCart();
      if (localCart && localCart.items) {
        state.items = localCart.items;
        cartSlice.caseReducers.calculateTotals(state);
        console.log('📦 Loaded cart from localStorage:', state.items.length, 'items');
      }
    },
    
    // Load cart from Firebase (for logged-in users)
    loadUserCart: (state, action) => {
      const userCart = action.payload;
      if (userCart && userCart.items) {
        state.items = userCart.items;
        cartSlice.caseReducers.calculateTotals(state);
        state.synced = true;
        console.log('📦 Loaded cart from Firebase:', state.items.length, 'items');
      }
    },
    
    // Save cart (to localStorage or Firebase based on auth state)
    saveCart: (state, action) => {
      const userId = action.payload?.userId;
      const cartData = { items: state.items };
      
      if (userId) {
        // User is logged in, save to Firebase
        saveUserCart(userId, cartData);
      } else {
        // Guest user, save to localStorage
        saveLocalCart(cartData);
      }
    },
    
    // Local cart operations (for guest users or immediate UI updates)
    addToCart: (state, action) => {
      // Handle both formats: { product, size, quantity } OR { id, name, price, image, size, quantity }
      const payload = action.payload;
      const product = payload.product || payload; // Support both wrapped and direct product data
      const size = payload.size || 'M';
      const quantity = payload.quantity || 1;
      const color = payload.color || 'Default';
      const userId = payload.userId; // Get userId if provided
      
      // Get product image (handle both image and images array)
      const productImage = product.image || product.images?.[0] || '/images/placeholder.png';
      
      const existingItem = state.items.find(
        item => item.id === product.id && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
        toast.success(`Updated ${product.name} quantity in cart`);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.salePrice || product.price,
          image: productImage,
          size,
          color,
          quantity,
        });
        toast.success(`${product.name} added to cart`);
      }

      cartSlice.caseReducers.calculateTotals(state);
      
      // Save to Firebase for logged-in users, localStorage for guests
      const cartData = { items: state.items };
      if (userId) {
        saveUserCart(userId, cartData);
      } else {
        saveLocalCart(cartData);
      }
    },

    removeFromCart: (state, action) => {
      const { id, size, color, userId } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.id === id && item.size === size && item.color === color
      );

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        toast.success(`${item.name} removed from cart`);
        cartSlice.caseReducers.calculateTotals(state);
        
        // Save to Firebase for logged-in users, localStorage for guests
        const cartData = { items: state.items };
        if (userId) {
          saveUserCart(userId, cartData);
        } else {
          saveLocalCart(cartData);
        }
      }
    },

    updateQuantity: (state, action) => {
      const { id, size, color, quantity, userId } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        if (quantity <= 0) {
          cartSlice.caseReducers.removeFromCart(state, { payload: { id, size, color, userId } });
        } else {
          item.quantity = quantity;
          cartSlice.caseReducers.calculateTotals(state);
          
          // Save to Firebase for logged-in users, localStorage for guests
          const cartData = { items: state.items };
          if (userId) {
            saveUserCart(userId, cartData);
          } else {
            saveLocalCart(cartData);
          }
        }
      }
    },

    clearCart: (state, action) => {
      const userId = action.payload?.userId;
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      toast.success('Cart cleared');
      
      // Save to Firebase for logged-in users, localStorage for guests
      const cartData = { items: [] };
      if (userId) {
        saveUserCart(userId, cartData);
      } else {
        saveLocalCart(cartData);
      }
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    calculateTotals: (state) => {
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      // Update aliases for backward compatibility
      state.total = state.totalAmount;
      state.itemCount = state.totalQuantity;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Fetch cart response:', action.payload);
        
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder-image.jpg',
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            _id: item._id, // Backend item ID for updates/deletion
          }));
          cartSlice.caseReducers.calculateTotals(state);
        } else {
          // Handle empty cart or different response structure
          state.items = [];
          state.totalQuantity = 0;
          state.totalAmount = 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error if it's just that the cart API isn't available
        if (action.payload !== 'cart_not_available') {
          state.error = action.payload;
        }
      })
      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Add to cart response:', action.payload);
        
        if (action.payload && action.payload.cart && action.payload.cart.items) {
          state.items = action.payload.cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder-image.jpg',
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            _id: item._id,
          }));
          cartSlice.caseReducers.calculateTotals(state);
          toast.success('Item added to cart');
        } else {
          console.error('Unexpected cart response structure:', action.payload);
          toast.error('Added to cart but failed to update display');
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add to cart');
      })
      // Update Cart Item
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.images[0],
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            _id: item._id,
          }));
          cartSlice.caseReducers.calculateTotals(state);
        }
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload || 'Failed to update cart');
      })
      // Remove from Cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.images[0],
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            _id: item._id,
          }));
          cartSlice.caseReducers.calculateTotals(state);
          toast.success('Item removed from cart');
        }
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload || 'Failed to remove item');
      })
      // Clear Cart
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
        toast.success('Cart cleared');
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload || 'Failed to clear cart');
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  calculateTotals,
  clearError,
  loadLocalCart,
  loadUserCart,
  saveCart,
} = cartSlice.actions;

export default cartSlice.reducer;
