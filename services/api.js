import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../constants/config';

const BASE_URL = CONFIG.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async makeRequest(endpoint, method = 'GET', data = null, includeAuth = false) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        data: {
          status: false,
          message: 'Network error or server is not reachable',
          error: error.message,
        },
      };
    }
  }

  async loginOtp(mobile) {
    return await this.makeRequest('/auth/login-otp', 'POST', { mobile });
  }

  async verifyOtp(fullName, mobile, otp) {
    return await this.makeRequest('/auth/verify-otp', 'POST', {
      full_name: fullName,
      mobile,
      otp,
    });
  }

  async register(fullName, mobileNumber, password) {
    return await this.makeRequest('/auth/register', 'POST', {
      full_name: fullName,
      mobile_number: mobileNumber,
      password,
    });
  }

  async verifyRegistration(otp, fullName, mobileNumber, password) {
    return await this.makeRequest('/auth/verify-registration', 'POST', {
      otp,
      full_name: fullName,
      mobile_number: mobileNumber,
      password,
    });
  }

  async saveToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async saveUserData(userData) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'userData']);
      return true;
    } catch (error) {
      console.error('Error clearing auth data:', error);
      return false;
    }
  }

  async isAuthenticated() {
    const token = await this.getToken();
    return !!token;
  }
}

export default new ApiService();