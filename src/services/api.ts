import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Instancia de Axios configurada con:
 * - Base URL del backend
 * - Interceptor que agrega JWT automáticamente
 * - Timeout de 10 segundos
 */

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * INTERCEPTOR DE REQUEST
 * Agrega el token JWT automáticamente a cada petición
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Agregar header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado al request:', config.method?.toUpperCase(), config.url);
    } else {
      console.log('⚠️ No hay token para:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTOR DE RESPONSE
 * Maneja respuestas del servidor (opcional)
 */
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta recibida de:', response.config.url, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Si el token expiró (401), podrías redirigir a login aquí
    if (error.response?.status === 401) {
      console.warn('⚠️ Token inválido o expirado');
      // Opcional: localStorage.removeItem('token');
      // Opcional: window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;