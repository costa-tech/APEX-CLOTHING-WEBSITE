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

  return await api.get(`/products?${params.toString()}`);
};

export const getProductById = async (id) => {
  return await api.get(`/products/${id}`);
};

export const searchProducts = async (query) => {
  return await api.get(`/products/search?q=${encodeURIComponent(query)}`);
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
