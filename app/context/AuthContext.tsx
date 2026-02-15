'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import apiClient from '@/app/lib/axios';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage and cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('freshCartToken') || Cookies.get('freshCartToken');
        const storedUser = localStorage.getItem('freshCartUser');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear corrupted data
        localStorage.removeItem('freshCartToken');
        localStorage.removeItem('freshCartUser');
        Cookies.remove('freshCartToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save token to both localStorage and cookies for better persistence
  const saveAuthData = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('freshCartToken', token);
    localStorage.setItem('freshCartUser', JSON.stringify(user));
    
    // Save token to cookie with 90 days expiry (to match JWT expiry)
    Cookies.set('freshCartToken', token, {
      expires: 90,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  };

  // Clear all auth data
  const clearAuthData = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('freshCartToken');
    localStorage.removeItem('freshCartUser');
    Cookies.remove('freshCartToken');
  };

  const login = async (values: any) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.post('/auth/signin', values);

      if (data.message === 'success') {
        const { token, user } = data;
        saveAuthData(token, user);
        toast.success('Welcome back!');
        
        // Check for redirect parameter in URL
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect') || '/';
        router.push(redirect);
      }
    } catch (error: any) {
      // Error is already handled by axios interceptor
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (values: any) => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.post('/auth/signup', values);

      if (data.message === 'success') {
        const { token, user } = data;
        saveAuthData(token, user);
        toast.success('Account created successfully!');
        router.push('/');
      }
    } catch (error: any) {
      // Error is already handled by axios interceptor
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      if (!token) return;
      
      // The API doesn't have a /users/me endpoint, so we'll keep the user data from login
      // If you update the profile, the updated data will be returned from the updateMe endpoint
      const storedUser = localStorage.getItem('freshCartUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};