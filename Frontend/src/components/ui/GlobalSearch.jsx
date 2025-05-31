import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock data for search results - in a real app, this would come from an API
  const mockData = [
    // Products
    { 
      id: 1, 
      title: 'Athletic Performance Tee', 
      type: 'product', 
      category: 'Tops',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
      url: '/products/1'
    },
    { 
      id: 2, 
      title: 'Premium Training Shorts', 
      type: 'product', 
      category: 'Bottoms',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop&crop=center',
      url: '/products/2'
    },
    { 
      id: 3, 
      title: 'Seamless Sports Bra', 
      type: 'product', 
      category: 'Tops',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1506629905607-45c9e9e46934?w=100&h=100&fit=crop&crop=center',
      url: '/products/3'
    },
    { 
      id: 4, 
      title: 'Ultra Flex Leggings', 
      type: 'product', 
      category: 'Bottoms',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop&crop=center',
      url: '/products/4'
    },
    // Pages
    { 
      id: 'home', 
      title: 'Home', 
      type: 'page', 
      description: 'Welcome to our clothing brand',
      url: '/'
    },
    { 
      id: 'products', 
      title: 'All Products', 
      type: 'page', 
      description: 'Browse our complete product collection',
      url: '/products'
    },
    { 
      id: 'cart', 
      title: 'Shopping Cart', 
      type: 'page', 
      description: 'View and manage your cart',
      url: '/cart'
    },
    // Categories
    { 
      id: 'tops', 
      title: 'Tops', 
      type: 'category', 
      description: 'T-shirts, tanks, and more',
      url: '/products?category=tops'
    },
    { 
      id: 'bottoms', 
      title: 'Bottoms', 
      type: 'category', 
      description: 'Shorts, leggings, and pants',
      url: '/products?category=bottoms'
    },
    { 
      id: 'activewear', 
      title: 'Activewear', 
      type: 'category', 
      description: 'Performance athletic wear',
      url: '/products?category=activewear'
    },
  ];

  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filtered = mockData.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setSearchResults(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  const handleResultClick = (result) => {
    navigate(result.url);
    onClose();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'product':
        return '🛍️';
      case 'page':
        return '📄';
      case 'category':
        return '🏷️';
      default:
        return '🔍';
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      product: 'bg-blue-100 text-blue-800',
      page: 'bg-green-100 text-green-800',
      category: 'bg-purple-100 text-purple-800',
    };
    
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Search Modal */}
        <div className="relative inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Search
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, pages, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="bg-white max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-6 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="py-2">
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-6 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {result.image ? (
                        <img
                          src={result.image}
                          alt={result.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeBadge(result.type)}`}>
                            {result.type}
                          </span>
                        </div>
                        {result.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {result.description}
                          </p>
                        )}
                        {result.category && (
                          <p className="text-xs text-gray-400">
                            {result.category}
                          </p>
                        )}
                        {result.price && (
                          <p className="text-sm font-medium text-gray-900">
                            ${result.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.trim() ? (
              <div className="px-6 py-8 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  No results found for "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">
                  Start typing to search products, pages, and categories
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-400">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Tops', 'Bottoms', 'Activewear', 'Accessories'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setSearchTerm(suggestion)}
                        className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span>{searchResults.length} results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
