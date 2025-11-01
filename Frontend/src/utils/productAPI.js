import api from './api';

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(','));
      } else if (!Array.isArray(value)) {
        params.append(key, value);
      }
    }
  });

  const response = await api.get(`/products?${params.toString()}`);
  
  // Extract products from the nested response structure
  if (response.status === 'success' && response.data) {
    return {
      products: response.data.products || [],
      pagination: response.data.pagination || {},
      totalPages: response.data.pagination?.totalPages || 1
    };
  }
  
  // Fallback for different response structures
  return {
    products: Array.isArray(response) ? response : (response.products || []),
    totalPages: 1
  };
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  
  // Extract product from nested response
  if (response.status === 'success' && response.data) {
    return response.data.product || response.data;
  }
  
  return response.product || response;
};

export const searchProducts = async (query) => {
  const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
  
  // Extract products from nested response
  if (response.status === 'success' && response.data) {
    return {
      products: response.data.products || [],
      totalPages: response.data.pagination?.totalPages || 1
    };
  }
  
  return {
    products: Array.isArray(response) ? response : (response.products || []),
    totalPages: 1
  };
};

export const getFeaturedProducts = async () => {
  return await api.get('/products/featured');
};

export const getProductsByCategory = async (category) => {
  return await api.get(`/products/category/${category}`);
};

export const createProduct = async (productData) => {
  return await api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async (id, productData) => {
  return await api.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};

export const getCategories = async () => {
  return await api.get('/products/categories');
};

export const uploadProductImages = async (productId, images) => {
  const formData = new FormData();
  images.forEach((image, index) => {
    formData.append(`images`, image);
  });

  return await api.post(`/products/${productId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
