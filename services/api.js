import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../constants/config';

const BASE_URL = CONFIG.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  getBaseUrl() {
    return CONFIG.BASE_URL; // Return the base URL for file uploads/images
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

  async getDoctors(limit = null, page = 1, specialtyId = null) {
    let endpoint = '/doctors';
    const params = [];
    
    if (limit) params.push(`limit=${limit}`);
    if (page) params.push(`page=${page}`);
    if (specialtyId) params.push(`specialization_id=${specialtyId}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }
    
    console.log('getDoctors API endpoint:', endpoint);
    return await this.makeRequest(endpoint, 'GET', null, true);
  }

  async getDoctorById(doctorId) {
    return await this.makeRequest(`/doctors/${doctorId}`, 'GET', null, true);
  }

  async getDoctorAvailability(doctorId, date) {
    return await this.makeRequest(`/doctors/${doctorId}/availability?date=${date}`, 'GET', null, true);
  }

  async getDoctorSlotsByDate(doctorId, date) {
    const params = `doctor_id=${doctorId}&date=${date}`;
    return await this.makeRequest(`/doctor_slots?${params}`, 'GET', null, true);
  }

  async bookAppointment(doctorId, appointmentData) {
    return await this.makeRequest(`/doctors/${doctorId}/appointments`, 'POST', appointmentData, true);
  }

  async createAvailabilitySlots(payload) {
    // payload should include: doctor_id, day_of_week, shift_type, start_time, end_time, slot_duration, slots[]
    return await this.makeRequest('/user/availabilityslots', 'POST', payload, true);
  }

  async getSpecializations(limit = null) {
    const endpoint = limit ? `/specializations?limit=${limit}` : '/specializations';
    return await this.makeRequest(endpoint, 'GET', null, true);
  }

  // Services API methods
  async getServices(limit = null, page = 1, search = null) {
    let endpoint = '/services';
    const params = [];
    
    if (limit) params.push(`limit=${limit}`);
    if (page) params.push(`page=${page}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    
    if (params.length > 0) {
      endpoint += '?' + params.join('&');
    }
    
    console.log('getServices API endpoint:', endpoint);
    return await this.makeRequest(endpoint, 'GET', null, true);
  }

  async getServiceById(serviceId) {
    return await this.makeRequest(`/services/${serviceId}`, 'GET', null, true);
  }
}

export default new ApiService();