import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to load user', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        // --- FIX 1 ---
        // This only runs after the 'try' or 'catch'
        setLoading(false);
      }
    } else {
      // --- FIX 2 (The Crtitical One) ---
      // If there's no token, we also must stop loading.
      setLoading(false);
    }
  }, []); // Empty dependency array is correct here

  // Load user data on app start
  useEffect(() => {
    loadUser();
  }, [loadUser]); // This is now safe

  // --- All other functions wrapped in useCallback ---
  
  const register = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response.data.msg };
    }
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      await loadUser();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response.data.msg };
    }
  }, [loadUser]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
     await loadUser();
  }, [loadUser]);

  // Wrap the context value in useMemo for performance
  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    register,
    loadUser,
    refreshUser
  }), [user, loading, login, logout, register, loadUser, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {/* This is also important: We don't render children until loading is false.
        If we did, the children might try to access 'user' while it's still null.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
};