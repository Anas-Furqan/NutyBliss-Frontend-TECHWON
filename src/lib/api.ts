import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL && typeof window !== 'undefined') {
  // Fail fast in the browser runtime (not at build-time).
  throw new Error('Missing NEXT_PUBLIC_API_URL. Set it in your frontend environment variables.');
}

const api = axios.create({
  // Keep build/SSR from crashing if env isn't injected yet.
  baseURL: API_URL || '',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { name: string; phone?: string }) =>
    api.put('/auth/profile', data),
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  addAddress: (data: any) => api.post('/auth/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/auth/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/auth/addresses/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (idOrSlug: string) => api.get(`/products/${encodeURIComponent(idOrSlug)}`),
  getRelated: (id: string) => api.get(`/products/${encodeURIComponent(id)}/related`),
  getCategories: () => api.get('/products/categories'),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string; description?: string }) => api.post('/categories', data),
  update: (id: string, data: { name?: string; description?: string; isActive?: boolean }) => api.put(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data: { productId: string; quantity: number; variant?: any }) =>
    api.post('/cart/add', data),
  update: (itemId: string, quantity: number) =>
    api.put(`/cart/item/${itemId}`, { quantity }),
  remove: (itemId: string) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  applyCoupon: (code: string) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// Orders API
export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOne: (id: string) => api.get(`/orders/${id}`),
  track: (orderNumber: string, email?: string) =>
    api.get('/orders/track', { params: { orderNumber, email } }),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId: string, params?: any) =>
    api.get(`/reviews/product/${productId}`, { params }),
  create: (data: { productId: string; rating: number; title?: string; comment: string }) =>
    api.post('/reviews', data),
  markHelpful: (id: string) => api.post(`/reviews/${id}/helpful`),
};

// Coupons API
export const couponsAPI = {
  validate: (code: string, orderTotal: number) =>
    api.post('/coupons/validate', { code, orderTotal }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/admin/users/${id}`, data),
  getLowStock: () => api.get('/admin/low-stock'),

  // Products
  getAllProducts: (params?: any) => api.get('/products/admin/all', { params }),
  getProductAdmin: (idOrSlug: string) => api.get(`/products/admin/${idOrSlug}`),
  createProduct: (data: any) => api.post('/products', data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),

  // Orders
  getAllOrders: (params?: any) => api.get('/orders', { params }),
  getOrderDetails: (id: string) => api.get(`/orders/${id}`),
  updateOrderStatus: (id: string, data: any) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id: string, reason?: string) => api.put(`/orders/${id}/cancel`, { reason }),

  // Reviews
  getAllReviews: (params?: any) => api.get('/reviews', { params }),
  moderateReview: (id: string, isApproved: boolean) =>
    api.put(`/reviews/${id}/moderate`, { isApproved }),

  // Coupons
  getAllCoupons: () => api.get('/coupons'),
  createCoupon: (data: any) => api.post('/coupons', data),
  updateCoupon: (id: string, data: any) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id: string) => api.delete(`/coupons/${id}`),

  // Upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Categories
  getAllCategories: () => api.get('/categories'),
  createCategory: (data: { name: string; description?: string }) => api.post('/categories', data),
  updateCategory: (id: string, data: { name?: string; description?: string; isActive?: boolean }) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export default api;
