import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as cartAPI from '../../utils/cartAPI';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.cart;
    } catch (error) {
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
  isOpen: false,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations (for guest users or immediate UI updates)
    addToCart: (state, action) => {
      const { product, size, quantity = 1, color = 'Default' } = action.payload;
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
          price: product.price,
          image: product.images[0],
          size,
          color,
          quantity,
        });
        toast.success(`${product.name} added to cart`);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const { id, size, color } = action.payload;
      const itemIndex = state.items.findIndex(
        item => item.id === id && item.size === size && item.color === color
      );

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.items.splice(itemIndex, 1);
        toast.success(`${item.name} removed from cart`);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    updateQuantity: (state, action) => {
      const { id, size, color, quantity } = action.payload;
      const item = state.items.find(
        item => item.id === id && item.size === size && item.color === color
      );

      if (item) {
        if (quantity <= 0) {
          cartSlice.caseReducers.removeFromCart(state, { payload: { id, size, color } });
        } else {
          item.quantity = quantity;
          cartSlice.caseReducers.calculateTotals(state);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      toast.success('Cart cleared');
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
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.items) {
          state.items = action.payload.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.images[0],
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            _id: item._id, // Backend item ID for updates/deletion
          }));
          cartSlice.caseReducers.calculateTotals(state);
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.isLoading = false;
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
          toast.success('Item added to cart');
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
} = cartSlice.actions;

export default cartSlice.reducer;
