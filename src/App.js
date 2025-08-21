import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PaymentTerminal from './components/PaymentTerminal';
import TransactionHistory from './components/TransactionHistory';
import Notifications from './components/Notifications';
import PayoutCredentials from './components/PayoutCredentials';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [merchantInfo, setMerchantInfo] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const merchantId = localStorage.getItem('merchant_id');
    const merchantName = localStorage.getItem('merchant_name');
    
    if (merchantId && merchantName) {
      setIsAuthenticated(true);
      setMerchantInfo({
        merchant_id: merchantId,
        merchant_name: merchantName
      });
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                setIsAuthenticated={setIsAuthenticated} 
                setMerchantInfo={setMerchantInfo} 
              />
            } 
          />
          <Route 
            path="/terminal" 
            element={
              isAuthenticated ? 
              <PaymentTerminal merchantInfo={merchantInfo} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/history" 
            element={
              isAuthenticated ? 
              <TransactionHistory merchantInfo={merchantInfo} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/notifications" 
            element={
              isAuthenticated ? 
              <Notifications merchantInfo={merchantInfo} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/payout" 
            element={
              isAuthenticated ? 
              <PayoutCredentials merchantInfo={merchantInfo} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
              <Navigate to="/terminal" /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;