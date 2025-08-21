import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTransactionHistory } from '../services/api';
import '../styles/TransactionHistory.css';

const TransactionHistory = ({ merchantInfo }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load transaction history on component mount
  useEffect(() => {
    const fetchTransactionHistory = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await getTransactionHistory();
        if (response.data.success) {
          setTransactions(response.data.transactions);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('merchant_id');
    localStorage.removeItem('merchant_name');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Transaction History</h1>
        <div className="merchant-info">
          <span>Welcome, {merchantInfo?.merchant_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="history-content">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading transaction history...</div>
        ) : (
          <div className="card">
            <h2>Recent Transactions</h2>
            
            {transactions.length === 0 ? (
              <p>No transactions found</p>
            ) : (
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Approval Code</th>
                    <th>MTI</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.transaction_id}>
                      <td>{formatDate(transaction.timestamp)}</td>
                      <td>{transaction.transaction_type}</td>
                      <td>{transaction.amount} {transaction.currency}</td>
                      <td>
                        <span className={`status-${transaction.status.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>{transaction.approval_code || 'N/A'}</td>
                      <td>{transaction.mti || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;