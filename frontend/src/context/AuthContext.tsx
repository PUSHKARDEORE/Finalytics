import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { healthAPI } from '../services/api';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearServerError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // First check if server is running
          await healthAPI.check();
          
          // Then verify the token
          const response = await authAPI.verifyToken();
          setUser(response.user);
          setServerError(null); // Clear any previous server errors
        } catch (error: any) {
          console.error('Token verification failed:', error);
          
          // Check if it's a server connection error
          if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
            setServerError('Server is not available. Please check if the backend server is running.');
          } else if (error.response?.status === 401) {
            // Token is invalid
            setServerError('Your session has expired. Please log in again.');
          } else {
            setServerError('Authentication failed. Please try again.');
          }
          
          // Clear invalid token and user data
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          
          // Redirect to login page if we're not already there
          if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
          }
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Fetch user data
      const userResponse = await authAPI.verifyToken();
      setUser(userResponse.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authAPI.register(email, password);
      const { token: newToken } = response;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      
      // Fetch user data
      const userResponse = await authAPI.verifyToken();
      setUser(userResponse.user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const clearServerError = () => {
    setServerError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    serverError,
    login,
    register,
    logout,
    clearServerError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 