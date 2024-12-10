// src/services/auth.service.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/auth"; // Replace with your actual API URL

// Register a new user
export const register = async ({name, email, password, password_confirmation, phone}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      password_confirmation,
      phone,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


// User login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// User logout
export const logout = async (loginToken) => {
  return await axios.post(
    `${API_URL}/logout`,
    {},
    { headers: { Authorization: `Bearer ${loginToken}` } }
  );
};
