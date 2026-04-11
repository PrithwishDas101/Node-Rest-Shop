import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api/endpoints';
import { toast } from '../utils/toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsInitialized(true);
  }, []);

  const signup = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.signup(email, password);
      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      toast.success('Signup successful!');
      
      return true;
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Signup failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: userData } = response.data.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(newToken);
      setUser(userData);
      toast.success('Login successful!');
      
      return true;
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Login failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const deleteAccount = useCallback(async (userId) => {
    setLoading(true);
    try {
      await authAPI.deleteAccount(userId);
      logout();
      toast.success('Account deleted successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Failed to delete account';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    isInitialized,
    isAuthenticated: !!token,
    signup,
    login,
    logout,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
