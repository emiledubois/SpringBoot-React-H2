import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Instancia de Axios configurada para el backend
 */
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de REQUEST
 * Agrega el token JWT SOLO si existe y NO es una ruta de autenticación
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    // ✓ CRÍTICO: NO agregar token a rutas de autenticación
    const isAuthRoute = config.url?.includes('/auth/');
    
    if (token && !isAuthRoute) {
      console.log(' Agregando token JWT a:', config.method?.toUpperCase(), config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isAuthRoute) {
      console.log(' Ruta de autenticación, NO se agrega token:', config.url);
    } else {
      console.warn(' No hay token para:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    console.error(' Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de RESPONSE
 * Maneja errores de forma centralizada
 */
api.interceptors.response.use(
  (response) => {
    console.log(' Respuesta exitosa:', response.config.url, '→', response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error(' Error en respuesta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Si es 401 o 403, limpiar token inválido
    if (error.response?.status === 401 || error.response?.status === 403) {
      const isAuthRoute = error.config?.url?.includes('/auth/');
      
      // Solo limpiar token si NO es ruta de autenticación
      if (!isAuthRoute) {
        console.warn(' Token inválido o expirado, limpiando localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir a login (opcional)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;