import React from 'react';
import { Box, Flex, Spacer, Button, Heading, Text, useToast, IconButton, useColorMode } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  return (
    <Box bg="teal.500" px={4} py={3}>
      <Flex alignItems="center">
        <Heading as="h1" size="md" color="white" cursor="pointer" onClick={() => navigate('/dashboard')}>
          Finalytics
        </Heading>
        <Spacer />
        <Box>
          {isAuthenticated ? (
            <Flex alignItems="center" gap={4}>
              <Text color="white" fontSize="sm">
                Welcome, {user?.email}
              </Text>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                colorScheme="teal"
                variant="ghost"
                size="sm"
              />
              <Button colorScheme="teal" variant="ghost" onClick={handleLogout}>
                Logout
          </Button>
            </Flex>
          ) : (
            <Flex alignItems="center" gap={2}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                colorScheme="teal"
                variant="ghost"
                size="sm"
              />
              {location.pathname === '/register' ? (
                <Button colorScheme="teal" variant="ghost" onClick={() => navigate('/')}>Login</Button>
              ) : location.pathname === '/' ? (
                <Button colorScheme="teal" variant="ghost" onClick={() => navigate('/register')}>Register</Button>
              ) : null}
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;