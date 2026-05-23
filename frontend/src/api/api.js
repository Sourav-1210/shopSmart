import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token if present
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('shopsmart_user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCategories = () => API.get('/products/categories');
export const getFeaturedProducts = () => API.get('/products/featured');

// Orders
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);
export const getMyOrders = () => API.get('/orders/my');

// Auth
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const toggleWishlist = (productId) => API.post(`/auth/wishlist/${productId}`);

export default API;
