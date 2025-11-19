import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as wishlistAPI from '../../utils/wishlistAPI';
import { 
  getLocalWishlist, 
  saveLocalWishlist, 
  saveUserWishlist 
} from '../../utils/userDataSync';

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      return response.wishlist;
    } catch (error) {
      // Silently fail if wishlist endpoint doesn't exist (404)
      if (error.response?.status === 404) {
        return rejectWithValue('wishlist_not_available');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      return response.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(productId);
      return response.wishlist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  synced: false, // Track if user data has been synced
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Load wishlist from localStorage on app init (for guests)
    loadLocalWishlist: (state) => {
      const localWishlist = getLocalWishlist();
      if (localWishlist && localWishlist.items) {
        state.items = localWishlist.items;
        console.log('💝 Loaded wishlist from localStorage:', state.items.length, 'items');
      }
    },
    
    // Load wishlist from Firebase (for logged-in users)
    loadUserWishlist: (state, action) => {
      const userWishlist = action.payload;
      if (userWishlist && userWishlist.items) {
        state.items = userWishlist.items;
        state.synced = true;
        console.log('💝 Loaded wishlist from Firebase:', state.items.length, 'items');
      }
    },
    
    // Local wishlist operations (for guest users)
    addToWishlist: (state, action) => {
      const product = action.payload.product || action.payload;
      const userId = action.payload.userId;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push(product);
        toast.success(`${product.name} added to wishlist`);
        
        // Save to Firebase for logged-in users, localStorage for guests
        const wishlistData = { items: state.items };
        if (userId) {
          saveUserWishlist(userId, wishlistData);
        } else {
          saveLocalWishlist(wishlistData);
        }
      } else {
        toast.info(`${product.name} is already in your wishlist`);
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = typeof action.payload === 'object' ? action.payload.productId : action.payload;
      const userId = typeof action.payload === 'object' ? action.payload.userId : null;
      const itemIndex = state.items.findIndex(item => item.id === productId);
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        toast.success(`${item.name} removed from wishlist`);
        
        // Save to Firebase for logged-in users, localStorage for guests
        const wishlistData = { items: state.items };
        if (userId) {
          saveUserWishlist(userId, wishlistData);
        } else {
          saveLocalWishlist(wishlistData);
        }
      }
    },

    clearWishlist: (state, action) => {
      const userId = action.payload?.userId;
      state.items = [];
      toast.success('Wishlist cleared');
      
      // Save to Firebase for logged-in users, localStorage for guests
      const wishlistData = { items: [] };
      if (userId) {
        saveUserWishlist(userId, wishlistData);
      } else {
        saveLocalWishlist(wishlistData);
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Fetch wishlist response:', action.payload);
        
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder-image.jpg',
            originalPrice: item.product.originalPrice,
            onSale: item.product.onSale,
          }));
        } else {
          // Handle empty wishlist
          state.items = [];
        }
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        // Don't set error if it's just that the wishlist API isn't available
        if (action.payload !== 'wishlist_not_available') {
          state.error = action.payload;
        }
      })
      // Add to Wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log('Add to wishlist response:', action.payload);
        
        if (action.payload && action.payload.wishlist && action.payload.wishlist.items) {
          state.items = action.payload.wishlist.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images && item.product.images[0] ? item.product.images[0] : '/placeholder-image.jpg',
            originalPrice: item.product.originalPrice,
            onSale: item.product.onSale,
          }));
          toast.success('Item added to wishlist');
        } else {
          console.error('Unexpected wishlist response structure:', action.payload);
          toast.error('Added to wishlist but failed to update display');
        }
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to add to wishlist');
      })
      // Remove from Wishlist
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images[0],
            originalPrice: item.product.originalPrice,
            onSale: item.product.onSale,
          }));
          toast.success('Item removed from wishlist');
        }
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload || 'Failed to remove from wishlist');
      });
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  clearError,
  loadLocalWishlist,
  loadUserWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
