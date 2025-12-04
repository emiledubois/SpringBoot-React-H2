import api from './api';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    token: string;
    type: string;
  };
}

const authService = {
  /**
   * Login - Retorna formato compatible con AuthContext
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log(' [authService] Iniciando login...');
    console.log(' [authService] Email:', credentials.email);
    
    try {
      // ✅ CORRECTO: /api/auth/login
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      
      console.log(' [authService] Response:', response.data);
      
      // Guardar token en localStorage
      const token = response.data.data.token;
      const user = {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        roles: response.data.data.roles
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log(' [authService] Token y user guardados en localStorage');
      
      return response.data;
      
    } catch (error: any) {
      console.error(' [authService] Error en login:', error);
      throw error;
    }
  },

  /**
   * Register - Retorna formato compatible con AuthContext
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    console.log(' [authService] Registrando usuario...');
    
    try {
      //  CORRECTO: /api/auth/register
      const response = await api.post<AuthResponse>('/api/auth/register', userData);
      
      console.log(' [authService] Registro exitoso:', response.data);
      
      // Guardar token en localStorage
      const token = response.data.data.token;
      const user = {
        id: response.data.data.id,
        name: response.data.data.name,
        email: response.data.data.email,
        roles: response.data.data.roles
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log(' [authService] Token y user guardados en localStorage');
      
      return response.data;
      
    } catch (error: any) {
      console.error(' [authService] Error en registro:', error);
      throw error;
    }
  },

  /**
   * Logout
   */
  logout: () => {
    console.log('🚪 [authService] Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Obtener token
   */
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  /**
   * Verificar si está autenticado
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Verificar si es admin
   */
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.roles.includes('ROLE_ADMIN') || false;
  }
};

export default authService;