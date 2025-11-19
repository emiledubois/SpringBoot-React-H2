import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

/**
 * Context de autenticación con API real
 * IE3.3.2 - Gestión de sesiones
 * IE3.3.3 - Restricciones de acceso
 */

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = authService.getCurrentUser();
        if (savedUser && authService.isAuthenticated()) {
          setUser({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            roles: savedUser.roles || []
          });
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          roles: response.data.roles || []
        };

        setUser(userData);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ name, email, password });

      if (response.success && response.data) {
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          roles: response.data.roles || []
        };

        setUser(userData);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrar usuario');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.roles?.includes('ROLE_ADMIN') || false;
  };

  const isAuthenticated = () => {
    return user !== null && authService.isAuthenticated();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
