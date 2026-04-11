import apiClient from './client';

// Auth APIs
export const authAPI = {
  signup: (email, password) => apiClient.post('/users/signup', { email, password }),
  login: (email, password) => apiClient.post('/users/login', { email, password }),
  getProfile: () => apiClient.get('/users/me'),
  deleteAccount: (userId) => apiClient.delete(`/users/${userId}`),
};

// Products APIs
export const productsAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (formData) => apiClient.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => apiClient.patch(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Orders APIs
export const ordersAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (productId, quantity) => apiClient.post('/orders', { productId, quantity }),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};

export default {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
};
