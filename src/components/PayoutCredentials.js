import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMerchantPayoutInfo, processPayout } from '../services/api';
import '../styles/PayoutCredentials.css';

const PayoutCredentials = ({ merchantInfo }) => {
  const [payoutInfo, setPayoutInfo] = useState(null);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [payoutMethod, setPayoutMethod] = useState('bank');
  const [payoutResult, setPayoutResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load payout information on component mount
  useEffect(() => {
    const fetchPayoutInfo = async () => {
      try {
        const response = await getMerchantPayoutInfo();
        if (response.data.success) {
          setPayoutInfo(response.data.payout_info);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching payout info:', err);
        setError('Failed to load payout information');
      }
    };
    
    fetchPayoutInfo();
  }, []);

  const handleProcessPayout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPayoutResult(null);
    
    try {
      const payoutData = {
        amount: parseFloat(amount),
        currency,
        payout_method: payoutMethod
      };
      
      const response = await processPayout(payoutData);
      setPayoutResult(response.data);
    } catch (err) {
      console.error('Payout processing error:', err);
      setError('Failed to process payout');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('merchant_id');
    localStorage.removeItem('merchant_name');
    navigate('/login');
  };

  return (
    <div className="payout-container">
      <div className="payout-header">
        <h1>Payout Credentials</h1>
        <div className="merchant-info">
          <span>Welcome, {merchantInfo?.merchant_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="payout-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="card">
          <h2>Merchant Payout Information</h2>
          
          {payoutInfo ? (
            <div className="payout-info">
              <div className="info-section">
                <h3>Bank Account Information</h3>
                {payoutInfo.bank_account ? (
                  <p>{payoutInfo.bank_account}</p>
                ) : (
                  <p className="not-configured">Not configured</p>
                )}
              </div>
              
              <div className="info-section">
                <h3>Cryptocurrency Wallet</h3>
                {payoutInfo.crypto_wallet ? (
                  <p>{payoutInfo.crypto_wallet}</p>
                ) : (
                  <p className="not-configured">Not configured</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading payout information...</p>
          )}
        </div>
        
        <div className="card payout-form-card">
          <h2>Process Payout</h2>
          
          <form onSubmit={handleProcessPayout}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="payoutMethod">Payout Method</label>
              <select
                id="payoutMethod"
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
              >
                <option value="bank">Bank Transfer</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Processing Payout...' : 'Process Payout'}
            </button>
          </form>
        </div>
        
        {payoutResult && (
          <div className="card payout-result-card">
            <h2>Payout Result</h2>
            <div className="result-details">
              <p><strong>Status:</strong> 
                <span className={payoutResult.success ? 'status-success' : 'status-error'}>
                  {payoutResult.success ? 'Success' : 'Error'}
                </span>
              </p>
              <p><strong>Message:</strong> {payoutResult.message}</p>
              {payoutResult.payout_id && (
                <p><strong>Payout ID:</strong> {payoutResult.payout_id}</p>
              )}
              <p><strong>Amount:</strong> {payoutResult.amount} {payoutResult.currency}</p>
              <p><strong>Method:</strong> {payoutResult.payout_method}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayoutCredentials;