import axios from 'axios';

// TEMPORARY HARDCODE - REPLACE WITH YOUR URL
const API = axios.create({
  baseURL: 'https://herrtz.onrender.com/api'
});

console.log('🚀 Using hardcoded URL:', 'https://herrtz.onrender.com/api');

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📡 Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default API;