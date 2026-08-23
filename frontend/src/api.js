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

// Se il server (Render free) sta riattivandosi, la richiesta fallisce senza
// risposta: riproviamo automaticamente fino a 3 volte con 15 secondi di attesa.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);
    config._retryCount = config._retryCount || 0;
    const noResponse = !error.response;
    if (noResponse && config._retryCount < 3) {
      config._retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 15000));
      return api(config);
    }
    return Promise.reject(error);
  }
);

export default api;
