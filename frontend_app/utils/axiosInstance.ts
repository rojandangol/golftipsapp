import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/url';
import { router } from 'expo-router';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
// In axiosInstance.tsx - Update the response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Don't auto-logout for password verification endpoint
    if (error.response?.status === 401) {
      const url = originalRequest.url || '';
      
      // // Allow 401 for password verification (it's expected for wrong password)
      // if (url.includes('/verifyPassword')) {
      //   return Promise.reject(error);
      // }

       // Allow 401 for endpoints where it's expected (wrong credentials)
      if (url.includes('/verifyPassword') || url.includes('/checkuserlogin')) {
        return Promise.reject(error);
      }
      
      // For other 401 errors, logout
      ('Session expired, logging out...');
      await clearAuthToken();
      router.replace('/');
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      ('Access forbidden');
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('tokenExpiry');
    await AsyncStorage.removeItem('userId');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};
export default axiosInstance;