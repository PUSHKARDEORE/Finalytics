import React, { useState } from 'react';
import { Box, Button, Input, Container, VStack, Heading, FormControl, FormLabel, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    setIsLoading(true);
    try {
      await register(email, password);
      toast({
        title: 'Registration successful',
        description: 'Welcome to Finalytics! You are now logged in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast({
        title: 'Registration failed',
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
          Register for Finalytics
        </Heading>
        <Text color="gray.600" textAlign="center">
          Create a new account to access your financial dashboard
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
          <FormControl id="confirmPassword" mt={4} isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
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
            loadingText="Registering..."
          >
            Register
          </Button>
        </Box>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          Already have an account? <span style={{ color: '#319795', cursor: 'pointer' }} onClick={() => navigate('/')}>Login</span>
        </Text>
      </VStack>
    </Container>
  );
};

export default Register; 