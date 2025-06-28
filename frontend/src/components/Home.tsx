import React from 'react';
import { Box, Heading, Text, Container, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container maxW="md" centerContent>
      <Box mt={8} textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          Welcome to Finalytics!
        </Heading>
        <Text fontSize="lg" mb={6}>
          Your personal financial dashboard.
        </Text>
        <Button colorScheme="teal" size="lg" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default Home;