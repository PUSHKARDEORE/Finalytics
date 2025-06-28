import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  VStack,
  HStack,
  Text,
  useToast,
  Box,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { transactionAPI } from '../services/api';

interface CSVExportProps {
  isOpen: boolean;
  onClose: () => void;
  filters?: any;
}

const CSVExport: React.FC<CSVExportProps> = ({ isOpen, onClose, filters = {} }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id', 'date', 'amount', 'category', 'status', 'user_id'
  ]);
  const [isExporting, setIsExporting] = useState(false);
  const toast = useToast();

  // Color mode values for dark mode support
  const textColor = useColorModeValue('gray.800', 'white');

  const availableColumns = [
    { key: 'id', label: 'Transaction ID' },
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'user_id', label: 'User ID' },
    { key: 'user_profile', label: 'User Profile' }
  ];

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(availableColumns.map(col => col.key));
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: 'No columns selected',
        description: 'Please select at least one column to export.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsExporting(true);
    try {
      const blob = await transactionAPI.exportCSV(selectedColumns, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export successful',
        description: 'CSV file has been downloaded successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export CSV file. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Export Transactions to CSV</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} color={textColor}>
            Select the columns you want to include in your CSV export:
          </Text>
          
          <Box mb={4}>
            <HStack spacing={4} mb={3}>
              <Button size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={handleSelectNone}>
                Select None
              </Button>
            </HStack>
            <Divider />
          </Box>

          <VStack align="start" spacing={3}>
            {availableColumns.map((column) => (
              <Checkbox
                key={column.key}
                isChecked={selectedColumns.includes(column.key)}
                onChange={() => handleColumnToggle(column.key)}
              >
                {column.label}
              </Checkbox>
            ))}
          </VStack>

          <Box mt={4} p={3} bg="blue.50" borderRadius="md">
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')}>
              <strong>Note:</strong> The export will include {selectedColumns.length} column(s) 
              and will respect any active filters.
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleExport}
            isLoading={isExporting}
            loadingText="Exporting..."
            isDisabled={selectedColumns.length === 0}
          >
            Export CSV
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CSVExport; 