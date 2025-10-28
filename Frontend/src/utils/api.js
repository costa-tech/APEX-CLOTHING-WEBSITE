import axios from 'axios';
import performanceMonitor from './performanceMonitor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token and start performance tracking
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Start performance tracking
    config.metadata = { startTime: performance.now() };
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors and track performance
api.interceptors.response.use(
  (response) => {
    // Track performance
    const duration = response.config.metadata 
      ? performance.now() - response.config.metadata.startTime 
      : 0;
    
    if (response.config.url) {
      performanceMonitor.trackApiCall(response.config.url, duration, true);
    }
    
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response.data;
  },
  (error) => {
    // Track failed performance
    const duration = error.config?.metadata 
      ? performance.now() - error.config.metadata.startTime 
      : 0;
    
    if (error.config?.url) {
      performanceMonitor.trackApiCall(error.config.url, duration, false);
    }
    
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.status, error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Network error handling
    if (!error.response) {
      console.error('🌐 Network Error: Could not connect to backend server');
      // You could show a toast notification here
    }
    
    return Promise.reject(error);
  }
);

export default api;
