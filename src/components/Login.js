import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginMerchant, registerMerchant } from '../services/api';
import '../styles/Login.css';

const Login = ({ setIsAuthenticated, setMerchantInfo }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await loginMerchant({ email, password });
      if (response.data.success) {
        // Save merchant info to localStorage
        localStorage.setItem('merchant_id', response.data.merchant_id);
        localStorage.setItem('merchant_name', response.data.merchant_name);
        
        // Update app state
        setIsAuthenticated(true);
        setMerchantInfo({
          merchant_id: response.data.merchant_id,
          merchant_name: response.data.merchant_name
        });
        
        // Navigate to terminal
        navigate('/terminal');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await registerMerchant({ merchant_name: merchantName, email, password });
      if (response.data.success) {
        // Save merchant info to localStorage
        localStorage.setItem('merchant_id', response.data.merchant_id);
        localStorage.setItem('merchant_name', merchantName);
        
        // Update app state
        setIsAuthenticated(true);
        setMerchantInfo({
          merchant_id: response.data.merchant_id,
          merchant_name: merchantName
        });
        
        // Navigate to terminal
        navigate('/terminal');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Payment Terminal</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="merchantName">Merchant Name</label>
              <input
                type="text"
                id="merchantName"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="regEmail">Email</label>
              <input
                type="email"
                id="regEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="regPassword">Password</label>
              <input
                type="password"
                id="regPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;