import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API running on gateway (port 8001 points to identity-driver in your setup, adjust if it points to Nginx on port 80)
// Using 8001 as specified in the instructions for local API
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:8001/api/v1' : 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor to add JWT token if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error fetching token for request interceptor:', error);
  }
  return config;
});

export default api;
