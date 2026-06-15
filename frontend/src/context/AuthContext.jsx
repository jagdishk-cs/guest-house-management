import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/** JWT auth against MongoDB backend */
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionCheckRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('admin');
      setAdmin(null);
      setLoading(false);
      return;
    }

    const checkId = ++sessionCheckRef.current;

    authAPI
      .me()
      .then((res) => {
        if (checkId !== sessionCheckRef.current) return;
        if (localStorage.getItem('token') !== token) return;
        setAdmin(res.data.admin);
        localStorage.setItem('admin', JSON.stringify(res.data.admin));
      })
      .catch(() => {
        if (checkId !== sessionCheckRef.current) return;
        if (localStorage.getItem('token') !== token) return;
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
      })
      .finally(() => {
        if (checkId === sessionCheckRef.current) setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    sessionCheckRef.current += 1;
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    setLoading(false);
    return data;
  };

  const logout = () => {
    sessionCheckRef.current += 1;
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
