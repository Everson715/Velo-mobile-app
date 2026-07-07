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

// Interceptor to add JWT token if available and log requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('jwt');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data ? 'Data: ' + JSON.stringify(config.data) : '');
  } catch (error) {
    console.error('Error fetching token for request interceptor:', error);
  }
  return config;
}, (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
});

// Interceptor to log responses
api.interceptors.response.use((response) => {
  console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
  return response;
}, (error) => {
  console.error(`[API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} - Status: ${error.response?.status}`, error.message);
  return Promise.reject(error);
});

export default api;
