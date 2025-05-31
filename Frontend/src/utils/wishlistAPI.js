import api from './api';

// Get user wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response;
  } catch (error) {
    throw error;
  }
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post('/wishlist/add', { productId });
    return response;
  } catch (error) {
    throw error;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// Clear entire wishlist
export const clearWishlist = async () => {
  try {
    const response = await api.delete('/wishlist/clear');
    return response;
  } catch (error) {
    throw error;
  }
};
