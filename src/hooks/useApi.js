// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const request = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args, user?.token);
      setData( response.data);
      return  response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, user?.token]);

  return { data, error, loading, request };
};