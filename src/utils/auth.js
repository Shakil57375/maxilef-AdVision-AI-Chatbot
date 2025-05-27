import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = ''; // Replace with your actual API URL

// Constants for token and user storage
const accessToken_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

// Token and user data management functions
export const auth = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem(accessToken_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens: () => {
    localStorage.removeItem(accessToken_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  },

  getAccessToken: () => localStorage.getItem(accessToken_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

  isAuthenticated: () => !!localStorage.getItem(accessToken_KEY),

  

  getUserData: () => {
    try {
      const data = localStorage.getItem(USER_DATA_KEY);
      if (!data) {
        return null; // No data in localStorage
      }

      const parsedData = JSON.parse(data);
      if (parsedData && typeof parsedData === 'object') {
        return parsedData;
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (error) {
      console.error('Failed to retrieve or parse user data:', error);
      localStorage.removeItem(USER_DATA_KEY);  // Clear corrupted data
      return null;
    }
  },




  updateUserData: (updates) => {
    const currentData = auth.getUserData();
    const updatedData = { ...currentData, ...updates };
    return updatedData;
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}api/auth/login`, { username, password });
      auth.setTokens(response.data.access, response.data.refresh);  // Store access and refresh tokens
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.data, {duration : 1000})
      throw error;  // Propagate error to the calling function
    }
  },


  signup: async (userData) => {
    const response = await axios.post(`${API_URL}/authentication_app/signup/`, userData);
    console.log(response.data)
    return response.data;
  },

  verifyEmail: async (email, otp) => {
    console.log(email, otp)
    const response = await axios.post(`${API_URL}/authentication_app/verify_email/`, { email, otp });
    return response.data;
  },

  getUserProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/authentication_app/user_profile/`, {
        headers: { Authorization: `Bearer ${auth.getAccessToken()}` }
      });
      const token = auth.getAccessToken();
      // Check if access token is still valid
      console.log(token)
      console.log("data", response.data)
      // Check if the response is JSON and contains valid data
      if (response.headers['content-type'].includes('application/json') && response.data) {
        return response.data;
      } else {
        throw new Error('Invalid user profile response');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

};
