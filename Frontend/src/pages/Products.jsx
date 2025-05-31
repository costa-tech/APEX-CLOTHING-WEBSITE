import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setFilters, clearFilters, setCurrentPage } from '../store/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductFilters from '../components/ui/ProductFilters';
import { HiOutlineFilter, HiOutlineX } from 'react-icons/hi';

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const { 
    products, 
    searchResults, 
    searchQuery, 
    isLoading, 
    filters, 
    totalPages, 
    currentPage 
  } = useSelector(state => state.products);

  // Mock products data for demo
  const mockProducts = [
    {
      id: 1,
      name: 'Elite Performance Tee',
      price: 45.99,
      originalPrice: 59.99,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.8,
      reviews: 234,
      isNew: true,
      onSale: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'White', 'Navy'],
      category: 'Men'
    },
    {
      id: 2,
      name: 'Training Shorts Pro',
      price: 39.99,
      originalPrice: 49.99,
      images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.6,
      reviews: 156,
      isNew: false,
      onSale: true,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Gray', 'Blue'],
      category: 'Women'
    },
    {
      id: 3,
      name: 'Premium Hoodie',
      price: 89.99,
      originalPrice: 119.99,
      images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.9,
      reviews: 342,
      isNew: true,
      onSale: false,
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Gray', 'Navy'],
      category: 'Men'
    },
    {
      id: 4,
      name: 'Athletic Leggings',
      price: 65.99,
      images: ['https://images.unsplash.com/photo-1506629905607-d9a42596dd2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
      rating: 4.7,
      reviews: 89,
      isNew: false,
      onSale: false,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Navy', 'Burgundy'],
      category: 'Women'
    },
    {
      id: 5,
      name: 'Sport Sneakers',
      price: 129.99,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'],
      rating: 4.8,
      reviews: 203,
      isNew: true,
      onSale: false,
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Red'],
      category: 'Shoes'
    },
    {
      id: 6,
      name: 'Wireless Earbuds',
      price: 99.99,
      originalPrice: 149.99,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80'],
      rating: 4.4,
      reviews: 67,
      isNew: false,
      onSale: true,
      sizes: ['One Size'],
      colors: ['Black', 'White'],
      category: 'Accessories'
    }
  ];

  const displayProducts = searchQuery ? searchResults : (products.length > 0 ? products : mockProducts);

  useEffect(() => {
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
    
    dispatch(fetchProducts(urlFilters));
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

  const filteredProducts = displayProducts.filter(product => {
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
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner message="Loading products..." />
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">No products found</div>
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
