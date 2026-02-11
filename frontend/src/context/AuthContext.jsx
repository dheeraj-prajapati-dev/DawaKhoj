import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const API = axios.create({
  baseURL: 'https://dawakhoj.onrender.com/api',
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setUser(null);
          // Optional: Clear any local user state if stored elsewhere
        }
        return Promise.reject(error);
      }
    );
    return () => API.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.warn("Session check: No active session.");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);