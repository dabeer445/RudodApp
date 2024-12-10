// src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import {
  login as apiLogin,
  register as apiRegister,
} from "@/src/services/auth.service";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = () => !!user;

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await apiLogin(email, password);
      const { user, token } = response; // Renamed variable to avoid shadowing
      setUser({ ...user, token }); // Update the state with the logged-in user
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({name, email, password, password_confirmation, phone}) => {
    setLoading(true);
    try {
      const response = await apiRegister({
        name,
        email,
        password,
        password_confirmation,
        phone,
      });
      const { user, token } = response;
      setUser({ ...user, token }); // Update the user state here!
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
