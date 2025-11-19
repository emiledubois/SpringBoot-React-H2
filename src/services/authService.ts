import api from './api';

/**
 * Servicio de autenticación
 * IE3.3.1 - Autenticación JWT
 * IE3.3.2 - Gestión de sesiones
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
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
     * Iniciar sesión
     */
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);

        if (response.data.success && response.data.data) {
            // Guardar token y datos de usuario en localStorage
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    },

    /**
     * Registrar nuevo usuario
     */
    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', userData);

        if (response.data.success && response.data.data) {
            // Guardar token y datos de usuario en localStorage
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }

        return response.data;
    },

    /**
     * Cerrar sesión
     */
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    /**
     * Obtener usuario actual desde localStorage
     */
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    /**
     * Verificar si hay usuario autenticado
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    /**
     * Verificar si el usuario es admin
     */
    isAdmin: (): boolean => {
        const user = authService.getCurrentUser();
        return user?.roles?.includes('ROLE_ADMIN') || false;
    },

    /**
     * Obtener token
     */
    getToken: (): string | null => {
        return localStorage.getItem('token');
    }
};

export default authService;
