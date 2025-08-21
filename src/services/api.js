import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,  // ✅ ensures cookies (sessions) sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication endpoints
export const registerMerchant = (merchantData) => api.post('/register', merchantData);

export const loginMerchant = (credentials) => api.post('/login', credentials);

export const logoutMerchant = () => api.post('/logout');

export const getMerchantInfo = () => api.get('/merchant/info');

export const getMerchantPayoutInfo = () => api.get('/merchant/payout');

// Protocol endpoints
export const getProtocols = () => api.get('/protocols');

// Transaction endpoints
export const processTransaction = (transactionData) => api.post('/transaction/process', transactionData);

export const getTransactionHistory = () => api.get('/transaction/history');

export const getTransaction = (transactionId) => api.get(`/transaction/${transactionId}`);

// Notification endpoints
export const getNotifications = () => api.get('/notifications');

// Payout endpoints
export const processPayout = (payoutData) => api.post('/payout/process', payoutData);

// Terminal status endpoint
export const getTerminalStatus = () => api.get('/terminal/status');

export default api;
