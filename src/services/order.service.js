// src/services/order.service.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/orders"; // Replace with your actual API URL

// Create a new order
export const createOrder = async (orderData, token) => {
  return await axios.post(`${API_URL}`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all orders (user specific)
export const getOrders = async (page, token, per_page = 3) => {
  return await axios.get(`${API_URL}?page=${page}&per_page=${per_page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get a specific order by ID
export const getOrderById = async (id, token) => {
  return await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get a specific order by ID
export const cancelOrder = async (id, token) => {
  return await axios.put(
    `${API_URL}/${id}/cancel`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
