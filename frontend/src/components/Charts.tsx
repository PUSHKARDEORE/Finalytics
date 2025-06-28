import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Heading, Text, useColorModeValue, IconButton, HStack } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

interface ChartsProps {
  stats: DashboardStats | null;
}

const chartTitles = [
  'Category Breakdown',
  'Transaction Status',
  'Monthly Trends'
];

const Charts: React.FC<ChartsProps> = ({ stats }) => {
  const [currentChart, setCurrentChart] = useState(0);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const gridColor = useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)');

  if (!stats) {
    return (
      <Box borderWidth="1px" borderRadius="lg" p={4} bg={bgColor} borderColor={borderColor}>
        <Text color={textColor}>Loading charts...</Text>
      </Box>
    );
  }

  // Chart options with dark mode support
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        color: textColor,
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };

  // Prepare data for category breakdown chart
  const categoryData = {
    labels: stats.categoryBreakdown.map(item => item._id),
    datasets: [
      {
        label: 'Amount ($)',
        data: stats.categoryBreakdown.map(item => item.total),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for status breakdown chart
  const statusData = {
    labels: stats.statusBreakdown.map(item => item._id),
    datasets: [
      {
        label: 'Count',
        data: stats.statusBreakdown.map(item => item.count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for monthly trends
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: Array(12).fill(0).map((_, index) => {
          const monthData = stats.monthlyTrends.filter(
            item => item._id.category === 'Revenue' && item._id.month === index + 1
          );
          return monthData.reduce((sum, item) => sum + item.total, 0);
        }),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Expenses',
        data: Array(12).fill(0).map((_, index) => {
          const monthData = stats.monthlyTrends.filter(
            item => item._id.category === 'Expense' && item._id.month === index + 1
          );
          return monthData.reduce((sum, item) => sum + item.total, 0);
        }),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  // Carousel logic
  const charts = [
    <Box key="category" w="100%" h="100%" minH="0">
      <Bar data={categoryData} options={chartOptions} />
    </Box>,
    <Box key="status" w="100%" h="100%" minH="0">
      <Bar data={statusData} options={chartOptions} />
    </Box>,
    <Box key="monthly" w="100%" h="100%" minH="0">
      <Line data={monthlyData} options={chartOptions} />
    </Box>
  ];

  const handlePrev = () => setCurrentChart((prev) => (prev === 0 ? charts.length - 1 : prev - 1));
  const handleNext = () => setCurrentChart((prev) => (prev === charts.length - 1 ? 0 : prev + 1));

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg={bgColor} borderColor={borderColor} h="100%" minH="0" display="flex" flexDirection="column" justifyContent="space-between">
      <Heading as="h2" size="lg" mb={4} color={textColor} textAlign="center">
        {chartTitles[currentChart]}
      </Heading>
      <Box flex={1} display="flex" alignItems="center" justifyContent="center" w="100%" h="100%" minH="0">
        {charts[currentChart]}
      </Box>
      <HStack justify="center" mt={4} spacing={4}>
        <IconButton aria-label="Previous chart" icon={<ArrowBackIcon />} onClick={handlePrev} variant="ghost" />
        {chartTitles.map((_, idx) => (
          <Box
            key={idx}
            w={3}
            h={3}
            borderRadius="50%"
            bg={idx === currentChart ? 'teal.400' : 'gray.400'}
            border={idx === currentChart ? '2px solid #319795' : '2px solid transparent'}
            transition="all 0.2s"
          />
        ))}
        <IconButton aria-label="Next chart" icon={<ArrowForwardIcon />} onClick={handleNext} variant="ghost" />
      </HStack>
    </Box>
  );
};

export default Charts;