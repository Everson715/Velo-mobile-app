import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'driver' | 'admin';
  phone?: string;
  status?: string; 
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log(`[AuthContext] Loading existing user session for: ${parsedUser.email} (Role: ${parsedUser.role})`);
          
          // Apply token to global API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setUser(parsedUser);
        } else {
          console.log('[AuthContext] No existing session found on app start.');
        }
      } catch (error) {
        console.error('[AuthContext] Error loading auth data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const signIn = async (token: string, userData: User) => {
    try {
      console.log(`[AuthContext] Saving session for: ${userData.email} (Role: ${userData.role})`);
      
      await AsyncStorage.setItem('jwt', token);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      console.log('[AuthContext] User signed in and state updated successfully.');
    } catch (error) {
      console.error('[AuthContext] Error storing auth data during sign in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthContext] Signing out current user.');
      await AsyncStorage.removeItem('jwt');
      await AsyncStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      console.log('[AuthContext] User signed out successfully.');
    } catch (error) {
      console.error('[AuthContext] Error removing auth data during sign out:', error);
    }
  };

  const updateUser = (updatedUser: User) => {
    console.log(`[AuthContext] Updating user data for: ${updatedUser.email}`);
    setUser(updatedUser);
    AsyncStorage.setItem('user', JSON.stringify(updatedUser)).catch(error => {
      console.error('[AuthContext] Error updating user in storage:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
