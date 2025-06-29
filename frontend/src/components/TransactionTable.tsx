import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  TableContainer, 
  Heading, 
  Box,
  Input,
  Select,
  HStack,
  Button,
  Text,
  Flex,
  Spacer,
  useToast,
  Badge,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';
import { transactionAPI } from '../services/api';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_id: string;
  user_profile: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: any) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  pagination, 
  onPageChange,
  onFiltersChange
}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    user_id: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    statuses: [],
    userIds: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Move all useColorModeValue hooks to the top
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const filterBgColor = useColorModeValue('gray.50', 'gray.700');
  const activeFilterBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeFilterTextColor = useColorModeValue('blue.800', 'blue.200');

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const options = await transactionAPI.getFilters();
      setFilterOptions(options);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch filter options',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // For search input, use debounce to avoid too many API calls
    if (key === 'search') {
      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      // Set new timeout for search
      const timeout = setTimeout(() => {
        applyFiltersImmediately(newFilters);
      }, 500); // 500ms delay
      
      setSearchTimeout(timeout);
    } else {
      // For dropdown selections, apply immediately
      applyFiltersImmediately(newFilters);
    }
  };

  const applyFiltersImmediately = (filterValues: any) => {
    setIsLoading(true);
    try {
      // Convert filters to API format
      const apiFilters: any = {};
      
      if (filterValues.search) {
        apiFilters.search = filterValues.search;
      }
      if (filterValues.category) {
        apiFilters.category = filterValues.category;
      }
      if (filterValues.status) {
        apiFilters.status = filterValues.status;
      }
      if (filterValues.user_id) {
        apiFilters.user_id = filterValues.user_id;
      }

      // Update active filters for display
      setActiveFilters(apiFilters);

      // Call the parent component's filter change handler
      onFiltersChange(apiFilters);
      
      toast({
        title: 'Filters applied',
        description: 'Transaction list has been filtered.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply filters',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    applyFiltersImmediately(filters);
  };

  const clearFilters = () => {
    // Clear search timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
    
    const emptyFilters = {
      search: '',
      category: '',
      status: '',
      user_id: ''
    };
    setFilters(emptyFilters);
    setActiveFilters({});
    onFiltersChange({});
    
    toast({
      title: 'Filters cleared',
      description: 'All filters have been removed.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg={bgColor} borderColor={borderColor}>
      <Heading as="h2" size="lg" mb={4}>Transactions</Heading>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Box mb={4} p={3} bg={activeFilterBgColor} borderRadius="md" borderColor={borderColor}>
          <Text fontWeight="bold" mb={2} color={activeFilterTextColor}>Active Filters:</Text>
          <HStack spacing={2} flexWrap="wrap">
            {activeFilters.search && (
              <Badge colorScheme="blue" variant="subtle">
                Search: {activeFilters.search}
              </Badge>
            )}
            {activeFilters.category && (
              <Badge colorScheme="green" variant="subtle">
                Category: {activeFilters.category}
              </Badge>
            )}
            {activeFilters.status && (
              <Badge colorScheme="purple" variant="subtle">
                Status: {activeFilters.status}
              </Badge>
            )}
            {activeFilters.user_id && (
              <Badge colorScheme="orange" variant="subtle">
                User: {activeFilters.user_id}
              </Badge>
            )}
          </HStack>
        </Box>
      )}
      
      {/* Filters */}
      <Box mb={4} p={4} bg={filterBgColor} borderRadius="md" borderColor={borderColor}>
        <Text fontWeight="bold" mb={2}>Filters</Text>
        <VStack spacing={3} align="stretch">
          <HStack spacing={4}>
            <Input
              placeholder="Search by ID, amount, date, category, status, or user..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              size="sm"
              bg={bgColor}
            />
            <Select
              placeholder="All Categories"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              size="sm"
              bg={bgColor}
            >
              {filterOptions.categories.map((category: string) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <Select
              placeholder="All Statuses"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              size="sm"
              bg={bgColor}
            >
              {filterOptions.statuses.map((status: string) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
            <Select
              placeholder="All Users"
              value={filters.user_id}
              onChange={(e) => handleFilterChange('user_id', e.target.value)}
              size="sm"
              bg={bgColor}
            >
              {filterOptions.userIds.map((userId: string) => (
                <option key={userId} value={userId}>{userId}</option>
              ))}
            </Select>
          </HStack>
          <HStack spacing={2}>
            <Button size="sm" variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </HStack>
        </VStack>
      </Box>

      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Description</Th>
              <Th isNumeric>Amount</Th>
              <Th>Category</Th>
              <Th>Status</Th>
              <Th>User ID</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{formatDate(transaction.date)}</Td>
                <Td>Transaction #{transaction.id}</Td>
                <Td isNumeric>{formatAmount(transaction.amount)}</Td>
                <Td>
                  <Box
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={transaction.category === 'Revenue' ? 'green.100' : 'red.100'}
                    color={transaction.category === 'Revenue' ? 'green.800' : 'red.800'}
                    fontSize="sm"
                    fontWeight="medium"
                    _dark={{
                      bg: transaction.category === 'Revenue' ? 'green.900' : 'red.900',
                      color: transaction.category === 'Revenue' ? 'green.200' : 'red.200'
                    }}
                  >
                    {transaction.category}
                  </Box>
                </Td>
                <Td>
                  <Box
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={transaction.status === 'Paid' ? 'green.100' : 'yellow.100'}
                    color={transaction.status === 'Paid' ? 'green.800' : 'yellow.800'}
                    fontSize="sm"
                    fontWeight="medium"
                    _dark={{
                      bg: transaction.status === 'Paid' ? 'green.900' : 'yellow.900',
                      color: transaction.status === 'Paid' ? 'green.200' : 'yellow.200'
                    }}
                  >
                    {transaction.status}
                  </Box>
                </Td>
                <Td>{transaction.user_id}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Flex mt={4} alignItems="center">
        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
          {pagination.totalItems} results
        </Text>
        <Spacer />
        <HStack spacing={2}>
          <Button
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            isDisabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Text fontSize="sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </Text>
          <Button
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            isDisabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TransactionTable;