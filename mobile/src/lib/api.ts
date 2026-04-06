import axios from 'axios';
import { useAuthStore } from './store';
import { Platform } from 'react-native';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator, or explicit local IP for physical devices
// In this case, we'll try to infer standard local IP for development
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout if token is expired/invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
