// src/api/apiService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;
let TOKEN = '';

export const signinUser = async (username, password) => {
  try {
    const authHeader = `Basic ${btoa(username + ":" + password)}`;
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, {}, {
      headers: {
        Authorization: authHeader,
      }
    });
    TOKEN = response.data.token; 
    return response.data;
  } catch (error) {
    console.error("Failed to login:", error.response || error);
    throw error;
  }
};

export const signupUser = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      username,
      password,
      role,
    });
    TOKEN = response.data.token; 
    return response.data;
  } catch (error) {
    console.error("Failed to signup:", error.response || error);
    throw error;
  }
};

export const getToken = () => TOKEN;
