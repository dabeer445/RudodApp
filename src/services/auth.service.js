// src/services/auth.service.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth'; // Replace with your actual API URL

// Register a new user
export const register = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

// User login
export const login = async (email, password) => {
    return await axios.post(`${API_URL}/login`, { email, password });
};

// User logout
export const logout = async (loginToken) => {
    return await axios.post(`${API_URL}/logout`, {}, { headers: { Authorization: `Bearer ${loginToken}` } });
};