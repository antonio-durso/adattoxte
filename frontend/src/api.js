import axios from 'axios';

// In sviluppo il proxy di Vite instrada /api verso il backend locale.
// In produzione si imposta VITE_API_URL con l'URL del backend (es. https://api.adattoxte.it).
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adt_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
