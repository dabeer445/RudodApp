// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native'; // Import Alert for user notifications
import { login as apiLogin, register as apiRegister } from '../services/auth.service'; // Adjust your import path

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      const { user, token } = response.data;

      // Here you would typically store the token in secure storage or context
      setUser({ ...user, token });
      Alert.alert('Login successful', 'Welcome back!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Error', error?.response?.data?.message || 'An error occurred'); // Basic error handling
      throw error; // Optionally re-throw the error
    }
  };

  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await apiRegister({ name, email, password, phone });
      const { user, token } = response.data;

      setUser({ ...user, token });
      Alert.alert('Registration successful', `Welcome, ${name}!`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Registration Error', error?.response?.data?.message || 'An error occurred'); // Basic error handling
      throw error; // Optionally re-throw the error
    }
  };

  const logout = () => {
    setUser(null);
    Alert.alert('Logged out', 'You have successfully logged out.'); // Inform the user 
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);