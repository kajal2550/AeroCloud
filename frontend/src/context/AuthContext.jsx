import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const loginWithGoogle = async (credential) => {
      try {
          const decodedToken = jwtDecode(credential);
          
          // Exchange Google credential with our backend for a proper JWT
          const res = await api.post('/auth/google', {
              name: decodedToken.name || "Google User",
              email: decodedToken.email,
              picture: decodedToken.picture,
              googleId: decodedToken.sub
          });

          // Store OUR server's JWT (not Google's token)
          localStorage.setItem('token', res.data.token);
          setUser(res.data.user);
          return res.data.user;
      } catch (err) {
          console.error("Google Auth Error:", err);
          throw new Error("Failed to process Google login");
      }
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
