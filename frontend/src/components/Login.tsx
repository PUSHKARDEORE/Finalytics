import React, { useState } from 'react';
import { Box, Button, Input, Container, VStack, Heading, FormControl, FormLabel, Text, useToast, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Color mode values for dark mode support
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const demoTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome to Finalytics!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxW="md" centerContent>
      <VStack spacing={4} mt={8} w="full">
        <Heading as="h1" size="xl">
          Sign in to Finalytics
        </Heading>
        <Text color={textColor} textAlign="center">
          Enter your credentials to access your financial dashboard
        </Text>
        <Box as="form" onSubmit={handleSubmit} noValidate w="full">
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              isDisabled={isLoading}
            />
          </FormControl>
          <FormControl id="password" mt={4} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              isDisabled={isLoading}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            mt={6}
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </Box>
        <Text fontSize="sm" color={demoTextColor} textAlign="center">
          Demo credentials: demo@example.com / demo123
        </Text>
        <Text fontSize="sm" color={demoTextColor} textAlign="center" mt={2}>
          Don&apos;t have an account?{' '}
          <span style={{ color: '#319795', cursor: 'pointer' }} onClick={() => navigate('/register')}>
            Register
          </span>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login;