import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as wishlistAPI from '../../utils/wishlistAPI';

// Async thunks for wishlist operations
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      return response.wishlist;
    } catch (error) {
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
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Local wishlist operations (for guest users)
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (!existingItem) {
        state.items.push(product);
        toast.success(`${product.name} added to wishlist`);
      } else {
        toast.info(`${product.name} is already in your wishlist`);
      }
    },

    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === productId);
      
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        toast.success(`${item.name} removed from wishlist`);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
      toast.success('Wishlist cleared');
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
        state.error = action.payload;
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
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
