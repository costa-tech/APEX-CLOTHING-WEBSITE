import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineX } from 'react-icons/hi';
import { removeFromWishlistAsync, fetchWishlist } from '../store/slices/wishlistSlice';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems, isLoading } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch wishlist on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleRemove = async (itemId) => {
    try {
      setLocalLoading(true);
      await dispatch(removeFromWishlistAsync(itemId)).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      setLocalLoading(true);
      await dispatch(addToCartAsync({
        productId: product.product?.id || product.product?._id || product.product_id,
        size: 'M', // Default size
        color: 'Default',
        quantity: 1
      })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLocalLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <HiOutlineHeart className="w-24 h-24 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start adding items you love to your wishlist!</p>
            <Link 
              to="/products" 
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
          <p className="text-gray-600 dark:text-gray-400">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const productId = product.id || product._id || item.product_id;
            const itemId = item.id || item._id;
            
            return (
              <div key={itemId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
                {/* Product Image */}
                <Link to={`/products/${productId}`} className="block relative aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] || product.image || '/placeholder-image.jpg'}
                    alt={product.name || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(itemId);
                    }}
                    disabled={localLoading}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  >
                    <HiOutlineX className="w-5 h-5 text-red-500" />
                  </button>

                  {/* Badge */}
                  {(product.salePrice || product.onSale) && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </span>
                  )}
                  
                  {/* Stock Badge */}
                  {product.stock <= 0 && (
                    <span className="absolute bottom-3 left-3 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded">
                      OUT OF STOCK
                    </span>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/products/${productId}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors line-clamp-2">
                      {product.name || 'Unknown Product'}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Rs. {Number(product.salePrice || product.price || 0).toFixed(2)}
                      </span>
                      {product.price && product.salePrice && product.price !== product.salePrice && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                          Rs. {Number(product.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={localLoading || (product.stock <= 0)}
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiOutlineShoppingBag className="w-5 h-5" />
                    <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
