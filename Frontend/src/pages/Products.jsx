import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, clearFilters, setCurrentPage } from '../store/slices/productSlice';
import ProductCard3D from '../components/ui/ProductCard3D';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductFilters from '../components/ui/ProductFilters';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);
  
  const { 
    products, 
    searchResults, 
    searchQuery, 
    isLoading, 
    filters, 
    totalPages, 
    currentPage,
    error: storeError
  } = useSelector(state => state.products);

  console.log('Products page state:', { 
    products, 
    searchResults, 
    searchQuery, 
    isLoading, 
    filters, 
    storeError 
  });

  // Mock products for development
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Cotton T-Shirt',
      price: 29.99,
      comparePrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      category: 'Men',
      onSale: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
    },
    {
      id: 2,
      name: 'Casual Denim Jacket',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
      category: 'Men',
      sizes: ['M', 'L', 'XL'],
      colors: ['Blue', 'Black'],
    },
    {
      id: 3,
      name: 'Sport Running Shoes',
      price: 89.99,
      comparePrice: 119.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
      category: 'Accessories',
      onSale: true,
      sizes: ['8', '9', '10', '11'],
      colors: ['Red', 'Black', 'White'],
    },
    {
      id: 4,
      name: 'Elegant Summer Dress',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
      category: 'Women',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['White', 'Blue', 'Pink'],
    },
    {
      id: 5,
      name: 'Designer Handbag',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
      category: 'Accessories',
      sizes: ['One Size'],
      colors: ['Brown', 'Black'],
    },
    {
      id: 6,
      name: 'Classic Polo Shirt',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400',
      images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
      category: 'Men',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Navy', 'Red'],
    },
    {
      id: 7,
      name: 'Yoga Leggings',
      price: 44.99,
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400'],
      category: 'Women',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Gray', 'Purple'],
    },
    {
      id: 8,
      name: 'Leather Watch',
      price: 129.99,
      comparePrice: 179.99,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400',
      images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400'],
      category: 'Accessories',
      onSale: true,
      sizes: ['One Size'],
      colors: ['Brown', 'Black'],
    },
  ];

  const displayProducts = searchQuery ? searchResults : (products.length > 0 ? products : mockProducts);

  // Normalize backend data to match frontend expectations
  const normalizedProducts = displayProducts.map(product => ({
    ...product,
    // Normalize category names to match frontend filters
    category: product.category === 'men' ? 'Men' : 
              product.category === 'women' ? 'Women' : 
              product.category === 'unisex' ? 'Men' : // Treat unisex as Men for filtering
              product.category,
    // Ensure image format consistency
    images: product.images ? product.images.map(img => 
      typeof img === 'string' ? img : img.url || img
    ) : [],
    // Normalize sizes to be consistent
    sizes: product.sizes ? product.sizes.map(size => 
      typeof size === 'string' ? size : size.size || size
    ) : [],
    // Normalize colors to be consistent  
    colors: product.colors ? product.colors.map(color => 
      typeof color === 'string' ? color : color.name || color
    ) : []
  }));

  console.log('Display products:', displayProducts);
  console.log('Normalized products:', normalizedProducts);

  useEffect(() => {
    console.log('Products useEffect triggered:', { searchParams: searchParams.toString() });
    
    // Initialize filters from URL params
    const urlFilters = {};
    const category = searchParams.get('category');
    const sale = searchParams.get('sale');
    const sort = searchParams.get('sort');
    
    if (category) urlFilters.category = category;
    if (sale) urlFilters.onSale = sale === 'true';
    if (sort) urlFilters.sortBy = sort;
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
    
    // Always try to fetch products
    dispatch(fetchProducts(urlFilters)).catch(err => {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products from server.');
    });
  }, [dispatch, searchParams]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (value && value !== 'All' && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params.set(key, value);
        }
      }
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchParams({});
  };
  const filteredProducts = normalizedProducts.filter(product => {
    if (filters.category && filters.category !== 'All' && product.category !== filters.category) {
      return false;
    }
    
    if (filters.priceRange && (product.price < filters.priceRange[0] || product.price > filters.priceRange[1])) {
      return false;
    }
    
    if (filters.sizes && filters.sizes.length > 0) {
      const hasSize = filters.sizes.some(size => product.sizes.includes(size));
      if (!hasSize) return false;
    }
    
    if (filters.colors && filters.colors.length > 0) {
      const hasColor = filters.colors.some(color => product.colors.includes(color));
      if (!hasColor) return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.isNew ? 1 : -1;
      default:
        return 0;
    }
  });

  return (
    <div className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-gray-600 mt-2">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
          >
            <HiOutlineFilter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>          {/* Products Grid */}
          <div className="flex-1">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                <div className="text-yellow-800">{error}</div>
                <button 
                  onClick={() => setError(null)} 
                  className="text-yellow-600 underline text-sm mt-2"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {storeError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="text-red-800">Store Error: {storeError}</div>
              </div>
            )}
            
            {isLoading ? (
              <LoadingSpinner message="Loading products..." />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard3D key={product.id || product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  {normalizedProducts.length === 0 ? 'No products available' : 'No products found matching your filters'}
                </div>
                <button
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
