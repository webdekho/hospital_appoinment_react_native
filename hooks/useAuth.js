import { useState, useEffect } from 'react';
import ApiService from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await ApiService.getToken();
      const userData = await ApiService.getUserData();
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token, userData) => {
    try {
      await ApiService.saveToken(token);
      await ApiService.saveUserData(userData);
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await ApiService.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };
};