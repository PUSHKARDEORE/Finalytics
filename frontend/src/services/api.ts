import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  verifyToken: async () => {
    const response = await api.get('/auth/protected');
    return response.data;
  },
};

// Transaction API
export const transactionAPI = {
  getTransactions: async (params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    category?: string;
    status?: string;
    user_id?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  }) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  getStats: async (params?: { 
    startDate?: string; 
    endDate?: string;
    category?: string;
    status?: string;
    user_id?: string;
    search?: string;
  }) => {
    const response = await api.get('/transactions/stats', { params });
    return response.data;
  },

  getFilters: async () => {
    const response = await api.get('/transactions/filters');
    return response.data;
  },

  exportCSV: async (columns: string[], filters: any) => {
    const response = await api.post('/transactions/export', { columns, filters }, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 