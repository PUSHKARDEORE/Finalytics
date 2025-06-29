import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
        <Router>
        <Header />
        <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        </Routes>
      </Router>
  );
};

// Main App Component
function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;