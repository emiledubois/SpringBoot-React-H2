import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    console.log('🔐 [AuthContext] Inicializando...');
    
    const loadUser = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      console.log('🔐 [AuthContext] Token en localStorage:', storedToken ? 'SÍ' : 'NO');
      console.log('🔐 [AuthContext] User en localStorage:', storedUser ? 'SÍ' : 'NO');

      if (storedToken && storedUser) {
        console.log('✅ [AuthContext] Restaurando sesión:', storedUser);
        setToken(storedToken);
        setUser(storedUser);
      } else {
        console.log('⚠️  [AuthContext] No hay sesión guardada');
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('═══════════════════════════════════════');
    console.log('🔐 [AuthContext.login] INICIANDO');
    console.log('═══════════════════════════════════════');
    console.log('🔐 [AuthContext.login] User recibido:', userData);
    console.log('🔐 [AuthContext.login] Token recibido:', authToken.substring(0, 20) + '...');
    
    setUser(userData);
    setToken(authToken);
    
    console.log('✅ [AuthContext.login] Estado actualizado');
    console.log('✅ [AuthContext.login] user state:', userData);
    console.log('✅ [AuthContext.login] token state:', authToken.substring(0, 20) + '...');
    console.log('═══════════════════════════════════════');
  };

  const logout = () => {
    console.log('🚪 [AuthContext] Cerrando sesión');
    
    authService.logout();
    setUser(null);
    setToken(null);
    
    console.log('✅ [AuthContext] Sesión cerrada');
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.roles.includes('ROLE_ADMIN') || false;

  console.log('🔐 [AuthContext] Estado actual:', {
    isAuthenticated,
    isAdmin,
    user: user?.email || 'none',
    hasToken: !!token
  });

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;