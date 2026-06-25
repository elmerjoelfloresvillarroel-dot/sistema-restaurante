import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// Configurar URL del backend base de forma dinámica
const VITE_API_URL = import.meta.env.VITE_API_URL;

// Redirigir dinámicamente llamadas API de 127.0.0.1 al host de producción o al host local actual (soporte de celular)
axios.interceptors.request.use((config) => {
  if (config.url && config.url.includes('127.0.0.1:8000')) {
    if (VITE_API_URL) {
      config.url = config.url.replace('http://127.0.0.1:8000', VITE_API_URL);
    } else {
      config.url = config.url.replace('127.0.0.1:8000', `${window.location.hostname}:8000`);
    }
  }
  return config;
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
