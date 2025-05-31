import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, clearFilters } from '../../store/slices/productSlice';
import { HiOutlineX } from 'react-icons/hi';

const ProductFilters = ({ showMobile = false, onClose }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.products);

  const categories = ['All', 'Men', 'Women', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Grey', 'Red', 'Blue', 'Green'];
  const priceRanges = [
    { label: 'Under $25', value: '0-25' },
    { label: '$25 - $50', value: '25-50' },
    { label: '$50 - $75', value: '50-75' },
    { label: '$75 - $100', value: '75-100' },
    { label: 'Over $100', value: '100-999' }
  ];

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handleMultiFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(item => item !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    dispatch(setFilters({ [filterType]: newValues }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter
  );

  const containerClasses = showMobile 
    ? "fixed inset-0 z-50 bg-white overflow-y-auto"
    : "space-y-6";

  return (
    <div className={containerClasses}>
      {showMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={showMobile ? "p-4 space-y-6" : "space-y-6"}>
        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear All Filters
          </button>
        )}

        {/* Category Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === category || (!filters.category && category === 'All')}
                  onChange={() => handleFilterChange('category', category === 'All' ? '' : category)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => handleMultiFilterChange('sizes', size)}
                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                  filters.sizes?.includes(size)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
          <div className="grid grid-cols-4 gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => handleMultiFilterChange('colors', color)}
                className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                  filters.colors?.includes(color)
                    ? 'border-black ring-2 ring-black ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ 
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() 
                }}
                title={color}
              >
                {filters.colors?.includes(color) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      color.toLowerCase() === 'white' || color.toLowerCase() === 'yellow' 
                        ? 'bg-black' 
                        : 'bg-white'
                    }`} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange === range.value}
                  onChange={() => handleFilterChange('priceRange', range.value)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
          <select
            value={filters.sortBy || ''}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Sale Items Toggle */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Sale Items Only</span>
          </label>
        </div>

        {showMobile && (
          <button
            onClick={onClose}
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
