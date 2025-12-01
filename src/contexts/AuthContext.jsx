import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  const SESSION_TIMEOUT_MS = (import.meta.env.VITE_SESSION_TIMEOUT || 10) * 60 * 1000;

  useEffect(() => {
    // Initialize user from localStorage
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      resetSessionTimeout();
    }
    setLoading(false);
  }, []);

  const resetSessionTimeout = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT_MS);

    setSessionTimeout(timeout);
  };

  const handleActivity = () => {
    resetSessionTimeout();
  };

  useEffect(() => {
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      resetSessionTimeout();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyMFA = async (userId, token) => {
    try {
      const data = await authService.verifyMFA(userId, token);
      if (data.user) {
        setUser(data.user);
      }
      resetSessionTimeout();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    handleLogout();
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    verifyMFA,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

