/**
 * Authentication Service
 * Handles user authentication operations
 */

import api from './api.service';

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} [userData.firstName] - First name
   * @param {string} [userData.lastName] - Last name
   * @returns {Promise<Object>} Authentication response with token and user info
   */
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
      });

      // Save token to localStorage
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.userInfo));
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} Authentication response with token and user info
   */
  async login(usernameOrEmail, password) {
    try {
      const response = await api.post('/api/auth/login', {
        usernameOrEmail,
        password,
      });

      // Save token to localStorage
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.userInfo));
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  /**
   * Get auth token
   * @returns {string|null} JWT token or null
   */
  getToken() {
    return localStorage.getItem('authToken');
  }
}

const authService = new AuthService();
export default authService;
