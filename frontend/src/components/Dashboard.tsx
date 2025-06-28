import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Grid, 
  GridItem, 
  useToast, 
  Spinner, 
  Center, 
  Text, 
  Button, 
  HStack, 
  useColorModeValue,
  VStack,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Container
} from '@chakra-ui/react';
import Charts from './Charts';
import TransactionTable from './TransactionTable';
import CSVExport from './CSVExport';
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

interface DashboardStats {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalTransactions: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  statusBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  monthlyTrends: Array<{
    _id: {
      year: number;
      month: number;
      category: string;
    };
    total: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCSVExportOpen, setIsCSVExportOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const toast = useToast();

  // Move all useColorModeValue hooks to the top
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Color values for stats
  const green600 = useColorModeValue('green.600', 'green.300');
  const green700 = useColorModeValue('green.700', 'green.200');
  const green500 = useColorModeValue('green.500', 'green.400');
  const red600 = useColorModeValue('red.600', 'red.300');
  const red700 = useColorModeValue('red.700', 'red.200');
  const red500 = useColorModeValue('red.500', 'red.400');
  const blue600 = useColorModeValue('blue.600', 'blue.300');
  const blue700 = useColorModeValue('blue.700', 'blue.200');
  const blue500 = useColorModeValue('blue.500', 'blue.400');
  const gray600 = useColorModeValue('gray.600', 'gray.300');
  const gray700 = useColorModeValue('gray.700', 'gray.200');
  const gray500 = useColorModeValue('gray.500', 'gray.400');
  const orange600 = useColorModeValue('orange.600', 'orange.300');
  const gray400 = useColorModeValue('gray.600', 'gray.400');

  const fetchTransactions = async (page = 1, filters = {}) => {
    try {
      const response = await transactionAPI.getTransactions({
        page,
        limit: 10,
        sortBy: 'date',
        sortOrder: 'desc',
        ...filters
      });
      setTransactions(response.transactions);
      setPagination(response.pagination);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchStats = async (filters = {}) => {
    try {
      const response = await transactionAPI.getStats(filters);
      setStats(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFiltersChange = async (filters: any) => {
    setCurrentFilters(filters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    await Promise.all([
      fetchTransactions(1, filters),
      fetchStats(filters)
    ]);
  };

  const handlePageChange = async (page: number) => {
    await fetchTransactions(page, currentFilters);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      await Promise.all([fetchTransactions(), fetchStats()]);
      setIsLoading(false);
    };

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color={textColor}>Loading dashboard...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh" p={6} pb={8}>
      {/* Header Section */}
      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h1" size="xl" color={textColor}>
            Financial Dashboard
          </Heading>
          <Button
            colorScheme="teal"
            onClick={() => setIsCSVExportOpen(true)}
            size="md"
          >
            Export CSV
          </Button>
        </Flex>
      </Box>

      {/* Main Dashboard Grid */}
      <Grid
        templateAreas={{
          base: `
            "stats"
            "charts"
            "transactions"
          `,
          lg: `
            "stats stats stats stats"
            "charts charts charts sidebar"
            "transactions transactions transactions transactions"
          `
        }}
        gridTemplateRows={{
          base: "auto auto 1fr",
          lg: "auto 1fr 1fr"
        }}
        gridTemplateColumns={{
          base: "1fr",
          lg: "1fr 1fr 1fr 280px"
        }}
        gap={6}
        h="calc(100vh - 140px - 32px)"
      >
        {/* Stats Cards */}
        <GridItem area="stats">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {stats && (
              <>
                <Box p={6} bg={cardBgColor} borderRadius="xl" border="1px" borderColor={borderColor} boxShadow="sm">
                  <Stat>
                    <StatLabel color={green600} fontSize="sm" fontWeight="medium">
                      Total Revenue
                    </StatLabel>
                    <StatNumber color={green700} fontSize="2xl" fontWeight="bold">
                      ${stats.summary.totalRevenue.toLocaleString()}
                    </StatNumber>
                    <StatHelpText color={green500}>
                      <StatArrow type="increase" />
                      12.5%
                    </StatHelpText>
                  </Stat>
                </Box>
                
                <Box p={6} bg={cardBgColor} borderRadius="xl" border="1px" borderColor={borderColor} boxShadow="sm">
                  <Stat>
                    <StatLabel color={red600} fontSize="sm" fontWeight="medium">
                      Total Expenses
                    </StatLabel>
                    <StatNumber color={red700} fontSize="2xl" fontWeight="bold">
                      ${stats.summary.totalExpenses.toLocaleString()}
                    </StatNumber>
                    <StatHelpText color={red500}>
                      <StatArrow type="decrease" />
                      8.2%
                    </StatHelpText>
                  </Stat>
                </Box>
                
                <Box p={6} bg={cardBgColor} borderRadius="xl" border="1px" borderColor={borderColor} boxShadow="sm">
                  <Stat>
                    <StatLabel color={blue600} fontSize="sm" fontWeight="medium">
                      Net Profit
                    </StatLabel>
                    <StatNumber 
                      color={stats.summary.netProfit >= 0 ? blue700 : red700} 
                      fontSize="2xl" 
                      fontWeight="bold"
                    >
                      ${stats.summary.netProfit.toLocaleString()}
                    </StatNumber>
                    <StatHelpText color={stats.summary.netProfit >= 0 ? blue500 : red500}>
                      <StatArrow type={stats.summary.netProfit >= 0 ? "increase" : "decrease"} />
                      {stats.summary.netProfit >= 0 ? "15.3%" : "3.1%"}
                    </StatHelpText>
                  </Stat>
                </Box>
                
                <Box p={6} bg={cardBgColor} borderRadius="xl" border="1px" borderColor={borderColor} boxShadow="sm">
                  <Stat>
                    <StatLabel color={gray600} fontSize="sm" fontWeight="medium">
                      Total Transactions
                    </StatLabel>
                    <StatNumber color={gray700} fontSize="2xl" fontWeight="bold">
                      {stats.summary.totalTransactions}
                    </StatNumber>
                    <StatHelpText color={gray500}>
                      <StatArrow type="increase" />
                      5.7%
                    </StatHelpText>
                  </Stat>
                </Box>
              </>
            )}
          </SimpleGrid>
        </GridItem>

        {/* Charts Section */}
        <GridItem area="charts">
          <Box 
            bg={cardBgColor} 
            borderRadius="xl" 
            border="1px" 
            borderColor={borderColor} 
            boxShadow="sm"
            h="full"
            p={6}
          >
            <Charts stats={stats} />
          </Box>
        </GridItem>

        {/* Sidebar */}
        <GridItem area="sidebar" display={{ base: 'none', lg: 'block' }}>
          <VStack spacing={6} h="full">
            {/* Quick Stats */}
            <Box 
              bg={cardBgColor} 
              borderRadius="xl" 
              border="1px" 
              borderColor={borderColor} 
              boxShadow="sm"
              p={6}
              w="full"
            >
              <Heading as="h3" size="md" mb={4} color={textColor}>Quick Stats</Heading>
              {stats && (
                <VStack spacing={3} align="stretch">
                  <Flex justify="space-between">
                    <Text color={textColor} fontSize="sm">Revenue Transactions:</Text>
                    <Text fontWeight="bold" color={green600}>
                      {stats.categoryBreakdown.find(c => c._id === 'Revenue')?.count || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color={textColor} fontSize="sm">Expense Transactions:</Text>
                    <Text fontWeight="bold" color={red600}>
                      {stats.categoryBreakdown.find(c => c._id === 'Expense')?.count || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color={textColor} fontSize="sm">Paid Transactions:</Text>
                    <Text fontWeight="bold" color={blue600}>
                      {stats.statusBreakdown.find(s => s._id === 'Paid')?.count || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text color={textColor} fontSize="sm">Pending Transactions:</Text>
                    <Text fontWeight="bold" color={orange600}>
                      {stats.statusBreakdown.find(s => s._id === 'Pending')?.count || 0}
                    </Text>
                  </Flex>
                </VStack>
              )}
            </Box>

            {/* Recent Activity or Additional Widgets can go here */}
            <Box 
              bg={cardBgColor} 
              borderRadius="xl" 
              border="1px" 
              borderColor={borderColor} 
              boxShadow="sm"
              p={6}
              w="full"
              flex={1}
            >
              <Heading as="h3" size="md" mb={4} color={textColor}>Recent Activity</Heading>
              <Text color={gray400} fontSize="sm">
                Dashboard activity and notifications will appear here.
              </Text>
            </Box>
          </VStack>
        </GridItem>

        {/* Transactions Table */}
        <GridItem area="transactions">
          <Box 
            bg={cardBgColor} 
            borderRadius="xl" 
            border="1px" 
            borderColor={borderColor} 
            boxShadow="sm"
            h="full"
            p={6}
          >
            <TransactionTable 
              transactions={transactions} 
              pagination={pagination}
              onPageChange={handlePageChange}
              onFiltersChange={handleFiltersChange}
            />
          </Box>
        </GridItem>
      </Grid>

      {/* CSV Export Modal */}
      <CSVExport
        isOpen={isCSVExportOpen}
        onClose={() => setIsCSVExportOpen(false)}
        filters={currentFilters}
      />
    </Box>
  );
};

export default Dashboard;