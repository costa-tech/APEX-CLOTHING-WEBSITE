import api from './api';

// Get user cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response;
  } catch (error) {
    throw error;
  }
};

// Add item to cart
export const addToCart = async (cartData) => {
  try {
    const response = await api.post('/cart', cartData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response;
  } catch (error) {
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.delete('/cart');
    return response;
  } catch (error) {
    throw error;
  }
};
