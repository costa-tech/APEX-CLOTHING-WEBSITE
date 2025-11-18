import api from './api';

/**
 * Get all coupons (Admin only)
 */
export const getAllCoupons = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
    if (filters.type) params.append('type', filters.type);

    const response = await api.get(`/v1/coupons?${params.toString()}`);
    return response;
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

/**
 * Create a new coupon (Admin only)
 */
export const createCoupon = async (couponData) => {
  try {
    const response = await api.post('/v1/coupons', couponData);
    return response;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
};

/**
 * Update a coupon (Admin only)
 */
export const updateCoupon = async (couponId, couponData) => {
  try {
    const response = await api.put(`/v1/coupons/${couponId}`, couponData);
    return response;
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
};

/**
 * Delete a coupon (Admin only)
 */
export const deleteCoupon = async (couponId) => {
  try {
    const response = await api.delete(`/v1/coupons/${couponId}`);
    return response;
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
};

/**
 * Validate a coupon code (Customer)
 */
export const validateCoupon = async (code, orderAmount) => {
  try {
    const response = await api.post('/v1/coupons/validate', {
      code,
      orderAmount,
    });
    return response;
  } catch (error) {
    console.error('Error validating coupon:', error);
    throw error;
  }
};

/**
 * Record coupon usage after successful order (Customer)
 */
export const useCoupon = async (code, orderId) => {
  try {
    const response = await api.post('/v1/coupons/use', {
      code,
      orderId,
    });
    return response;
  } catch (error) {
    console.error('Error using coupon:', error);
    throw error;
  }
};

export default {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  useCoupon,
};
