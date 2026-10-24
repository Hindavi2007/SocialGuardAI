import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sg_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sg_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token freshness against /api/auth/me
      api.getMe()
        .then(data => {
          setUser(data.user);
          localStorage.setItem('sg_user', JSON.stringify(data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sg_token', data.token);
    localStorage.setItem('sg_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password, confirm_password) => {
    const data = await api.register(name, email, password, confirm_password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('sg_token', data.token);
    localStorage.setItem('sg_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sg_token');
    localStorage.removeItem('sg_user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sg_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
