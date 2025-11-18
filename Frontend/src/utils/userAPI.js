import api from './api';

/**
 * Get all users (Admin only)
 * @param {Object} params - Query parameters (page, limit, role, status, sortBy, order)
 * @returns {Promise} - Users data with pagination
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/v1/users', { params });
    return response;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user by ID (Admin only)
 * @param {string} id - User ID
 * @returns {Promise} - User data
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/v1/users/${id}`);
    return response;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update user (Admin only)
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise} - Updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/v1/users/${id}`, userData);
    return response;
  } catch (error) {
    console.error('Update user error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete user (Admin only)
 * @param {string} id - User ID
 * @returns {Promise} - Success message
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/v1/users/${id}`);
    return response;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update user status (Admin only)
 * @param {string} id - User ID
 * @param {string} status - New status (Active, Inactive, Suspended)
 * @returns {Promise} - Updated user data
 */
export const updateUserStatus = async (id, status) => {
  try {
    const response = await api.patch(`/v1/users/${id}/status`, { status });
    return response;
  } catch (error) {
    console.error('Update user status error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update user role (Admin only)
 * @param {string} id - User ID
 * @param {string} role - New role (customer, admin, moderator)
 * @returns {Promise} - Updated user data
 */
export const updateUserRole = async (id, role) => {
  try {
    const response = await api.patch(`/v1/users/${id}/role`, { role });
    return response;
  } catch (error) {
    console.error('Update user role error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get user statistics (Admin only)
 * @returns {Promise} - User statistics
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/v1/users/stats/summary');
    return response;
  } catch (error) {
    console.error('Get user stats error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} - User profile data
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/v1/users/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update current user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Updated profile data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/v1/users/profile', profileData);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || error;
  }
};
