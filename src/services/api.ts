import axios from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator, localhost for iOS simulator
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2' : 'http://localhost';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Interceptor to add JWT token if needed in the future
api.interceptors.request.use(async (config) => {
  // const token = await AsyncStorage.getItem('jwt');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
