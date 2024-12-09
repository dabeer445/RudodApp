// src/services/message.service.js
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/messages";

// Fetch messages for a specific order
export const fetchMessages = async (orderId, token) => {
  return await axios.get(`${API_URL}?order_id=${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUnreadMessages = async (token) => {
    return await axios.get(API_URL+'/unread', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
// Send a new message
export const sendMessage = async (orderId, content, token) => {
  return await axios.post(
    API_URL,
    {
      order_id: orderId,
      content: content,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
