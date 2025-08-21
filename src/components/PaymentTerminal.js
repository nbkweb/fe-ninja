import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProtocols, processTransaction } from '../services/api';
import '../styles/PaymentTerminal.css';

const PaymentTerminal = ({ merchantInfo }) => {
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [approvalCode, setApprovalCode] = useState('');
  const [transactionType, setTransactionType] = useState('SALE');
  const [paymentMethod, setPaymentMethod] = useState('MANUAL_ENTRY');
  const [isOnline, setIsOnline] = useState(true);
  const [transactionResult, setTransactionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load protocols on component mount
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await getProtocols();
        if (response.data.success) {
          setProtocols(response.data.protocols);
        }
      } catch (err) {
        console.error('Error fetching protocols:', err);
        setError('Failed to load protocols');
      }
    };
    
    fetchProtocols();
  }, []);

  const handleProcessTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTransactionResult(null);
    
    try {
      // Validate approval code based on selected protocol
      if (selectedProtocol) {
        const protocolConfig = protocols[selectedProtocol];
        if (protocolConfig) {
          const expectedLength = protocolConfig.approval_length;
          
          if (approvalCode.length !== expectedLength) {
            setError(`Approval code must be ${expectedLength} digits for selected protocol`);
            setLoading(false);
            return;
          }
          
          // Validate that approval code is numeric
          if (!/^\d+$/.test(approvalCode)) {
            setError('Approval code must contain only digits');
            setLoading(false);
            return;
          }
        }
      }
      
      const transactionData = {
        amount: parseFloat(amount),
        currency,
        transaction_type: transactionType,
        payment_method: paymentMethod,
        protocol: selectedProtocol,
        is_online: isOnline,
        card_data: {
          card_number: cardNumber,
          expiry_date: expiryDate,
          cvv: cvv
        }
      };
      
      const response = await processTransaction(transactionData);
      
      if (response.data.success) {
        setTransactionResult(response.data.transaction);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Transaction processing error:', err);
      setError('Failed to process transaction');
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
    <div className="terminal-container">
      <div className="terminal-header">
        <h1>Payment Terminal</h1>
        <div className="merchant-info">
          <span>Welcome, {merchantInfo?.merchant_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="terminal-content">
        <div className="card transaction-form-card">
          <h2>Process Transaction</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleProcessTransaction}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="transactionType">Transaction Type</label>
                <select
                  id="transactionType"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                >
                  <option value="SALE">Sale</option>
                  <option value="REFUND">Refund</option>
                  <option value="VOID">Void</option>
                  <option value="PRE_AUTH">Pre-Authorization</option>
                  <option value="PRE_AUTH_COMPLETION">Pre-Authorization Completion</option>
                  <option value="BALANCE_INQUIRY">Balance Inquiry</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="MANUAL_ENTRY">Manual Entry</option>
                  <option value="CARD_SWIPE">Card Swipe</option>
                  <option value="CARD_DIP">Card Dip</option>
                  <option value="CARD_NFC">Card NFC</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="protocol">Protocol</label>
              <select
                id="protocol"
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                required
              >
                <option value="">Select a protocol</option>
                {Object.keys(protocols).map((protocol) => (
                  <option key={protocol} value={protocol}>
                    {protocol}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Enter card number"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  required
                />
              </div>
            </div>
            
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
              <label htmlFor="approvalCode">Approval Code</label>
              <input
                type="text"
                id="approvalCode"
                value={approvalCode}
                onChange={(e) => setApprovalCode(e.target.value)}
                placeholder="Enter approval code"
                required
              />
              <small>Enter the 4 or 6 digit approval code from customer</small>
            </div>
            
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                />
                Process Online
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || !selectedProtocol}
            >
              {loading ? 'Processing...' : 'Process Transaction'}
            </button>
          </form>
        </div>
        
        {transactionResult && (
          <div className="card transaction-result-card">
            <h2>Transaction Result</h2>
            <div className="result-details">
              <p><strong>ID:</strong> {transactionResult.transaction_id}</p>
              <p><strong>Status:</strong> 
                <span className={`status-${transactionResult.status.toLowerCase()}`}>
                  {transactionResult.status}
                </span>
              </p>
              <p><strong>Amount:</strong> {transactionResult.amount} {transactionResult.currency}</p>
              <p><strong>Approval Code:</strong> {transactionResult.approval_code}</p>
              <p><strong>MTI:</strong> {transactionResult.mti}</p>
              <p><strong>Protocol:</strong> {transactionResult.protocol}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTerminal;