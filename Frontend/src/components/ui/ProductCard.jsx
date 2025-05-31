import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag, HiOutlineStar } from 'react-icons/hi';
import { addToCartAsync } from '../../store/slices/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync } from '../../store/slices/wishlistSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { items: wishlistItems } = useSelector(state => state.wishlist);

  // Mock product data if not provided
  const mockProduct = {
    id: Math.random(),
    name: 'Premium Athletic Hoodie',
    price: 89.99,
    originalPrice: 119.99,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'],
    rating: 4.5,
    reviews: 128,
    isNew: true,
    onSale: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray'],
    ...product
  };
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    // Default to first available size
    const defaultSize = mockProduct.sizes[0];
    const defaultColor = mockProduct.colors[0];
    
    dispatch(addToCartAsync({
      productId: mockProduct.id,
      size: defaultSize,
      color: defaultColor,
      quantity: 1
    }));
  };
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    const isWishlisted = wishlistItems.some(item => item.id === mockProduct.id);
    
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(mockProduct.id));
    } else {
      dispatch(addToWishlistAsync(mockProduct.id));
    }
  };

  const isWishlisted = wishlistItems.some(item => item.id === mockProduct.id);

  const discountPercentage = mockProduct.originalPrice 
    ? Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/products/${mockProduct.id}`}
      className="group block bg-white rounded-lg overflow-hidden card-hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={mockProduct.images[0]}
          alt={mockProduct.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {mockProduct.isNew && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {mockProduct.onSale && discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">          <button
            onClick={handleWishlist}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
            aria-label="Add to wishlist"
          >
            {isWishlisted ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200"
            aria-label="Add to cart"
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        
        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="w-full bg-white text-black py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors duration-200">
            {mockProduct.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <HiOutlineStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(mockProduct.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({mockProduct.reviews})
          </span>
        </div>

        {/* Colors */}
        <div className="flex items-center mb-3">
          <span className="text-sm text-gray-500 mr-2">Colors:</span>
          <div className="flex space-x-1">
            {mockProduct.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border border-gray-300 ${
                  color.toLowerCase() === 'black' ? 'bg-black' :
                  color.toLowerCase() === 'white' ? 'bg-white' :
                  color.toLowerCase() === 'gray' ? 'bg-gray-500' :
                  'bg-blue-500'
                }`}
              />
            ))}
            {mockProduct.colors.length > 3 && (
              <span className="text-xs text-gray-500">+{mockProduct.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${mockProduct.price}
            </span>
            {mockProduct.originalPrice && mockProduct.originalPrice > mockProduct.price && (
              <span className="text-sm text-gray-500 line-through">
                ${mockProduct.originalPrice}
              </span>
            )}
          </div>
          
          {/* Sizes */}
          <div className="text-xs text-gray-500">
            {mockProduct.sizes.join(', ')}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
