import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productAPI from '../../utils/productAPI';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProducts(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const response = await productAPI.searchProducts(query);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  featuredProducts: [],
  categories: [
    'All',
    'Men',
    'Women',
    'Accessories',
    'Shoes',
    'Activewear',
    'Casual',
    'Formal'
  ],
  filters: {
    category: 'All',
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
    sortBy: 'newest',
  },
  isLoading: false,
  isProductLoading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  searchQuery: '',
  searchResults: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: 'All',
        priceRange: [0, 1000],
        sizes: [],
        colors: [],
        sortBy: 'newest',
      };
      state.currentPage = 1;
    },
    
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.featuredProducts = action.payload.featured || [];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isProductLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isProductLoading = false;
        state.error = action.payload;
      })
      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.products || action.payload;
        state.error = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setCurrentPage,
  setSearchQuery,
  clearSearchResults,
  clearError,
  clearCurrentProduct,
} = productSlice.actions;

export default productSlice.reducer;
