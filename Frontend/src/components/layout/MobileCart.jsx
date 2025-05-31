import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineX, HiPlus, HiMinus, HiOutlineTrash } from 'react-icons/hi';
import { toggleCart, fetchCart, updateCartItemAsync, removeFromCartAsync } from '../../store/slices/cartSlice';

const MobileCart = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount, isOpen } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user && isOpen) {
      dispatch(fetchCart());
    }
  }, [dispatch, user, isOpen]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCartAsync(itemId));
    } else {
      dispatch(updateCartItemAsync({ itemId, quantity: newQuantity }));
    }
  };
  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCartAsync(itemId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => dispatch(toggleCart())}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart ({itemCount})</h2>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">Your cart is empty</div>
                <Link
                  to="/products"
                  onClick={() => dispatch(toggleCart())}
                  className="btn-primary inline-block"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="font-semibold text-sm mt-1">${item.price}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <HiMinus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                          >
                            <HiPlus className="w-4 h-4" />
                          </button>
                        </div>
                          <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Link
                  to="/cart"
                  onClick={() => dispatch(toggleCart())}
                  className="btn-secondary w-full text-center block"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(toggleCart())}
                  className="btn-primary w-full text-center block"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCart;
