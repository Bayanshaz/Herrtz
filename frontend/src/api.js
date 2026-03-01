import axios from 'axios';

// Make sure this points to your Render backend
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://herrtz.onrender.com/api'
});

// Log the URL for debugging
console.log('🔗 API Base URL:', API.defaults.baseURL);

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📡 Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default API;