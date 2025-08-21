import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication endpoints
export const registerMerchant = (merchantData) => {
  return api.post('/register', merchantData);
};

export const loginMerchant = (credentials) => {
  return api.post('/login', credentials);
};

export const logoutMerchant = () => {
  return api.post('/logout');
};

export const getMerchantInfo = () => {
  return api.get('/merchant/info');
};

export const getMerchantPayoutInfo = () => {
  return api.get('/merchant/payout');
};

// Protocol endpoints
export const getProtocols = () => {
  return api.get('/protocols');
};

// Transaction endpoints
export const processTransaction = (transactionData) => {
  return api.post('/transaction/process', transactionData);
};

export const getTransactionHistory = () => {
  return api.get('/transaction/history');
};

export const getTransaction = (transactionId) => {
  return api.get(`/transaction/${transactionId}`);
};

// Notification endpoints
export const getNotifications = () => {
  return api.get('/notifications');
};

// Payout endpoints
export const processPayout = (payoutData) => {
  return api.post('/payout/process', payoutData);
};

// Terminal status endpoint
export const getTerminalStatus = () => {
  return api.get('/terminal/status');
};

export default api;