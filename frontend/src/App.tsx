import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { theme } from './theme';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';

// Loading Component
const LoadingScreen: React.FC = () => (
  <Center h="100vh">
    <VStack spacing={4}>
      <Spinner size="xl" color="teal.500" />
      <Text>Verifying authentication...</Text>
    </VStack>
  </Center>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// App Content Component
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while verifying authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

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