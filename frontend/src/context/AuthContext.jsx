import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adt_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/me')
      .then((r) => setUser(r.data.user))
      .catch(() => {
        localStorage.removeItem('adt_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const r = await api.post('/auth/login', { email, password });
    localStorage.setItem('adt_token', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  }

  async function register(payload) {
    const r = await api.post('/auth/register', payload);
    localStorage.setItem('adt_token', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  }

  function logout() {
    localStorage.removeItem('adt_token');
    setUser(null);
  }

  async function refresh() {
    const r = await api.get('/me');
    setUser(r.data.user);
    return r.data.user;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
