import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localAuthService } from '../services/localAuthService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const currentUser = localAuthService.getCurrentUser();
    const currentToken = localAuthService.getToken();

    if (currentToken && currentUser) {
      setToken(currentToken);
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = localAuthService.login(email, password);

    if (!result.success) {
      throw new Error(result.error || 'Login failed');
    }

    setToken(result.token!);
    setUser(result.user!);
  };

  const register = async (name: string, email: string, password: string) => {
    const result = localAuthService.register(name, email, password);

    if (!result.success) {
      throw new Error(result.error || 'Registration failed');
    }

    setToken(result.token!);
    setUser(result.user!);
  };

  const logout = () => {
    localAuthService.logout();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}