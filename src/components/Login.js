import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

    // Simple hardcoded login logic
    setTimeout(() => {
      if (email === 'admin' && password === 'password') {
        localStorage.setItem('merchant_id', 'admin');
        localStorage.setItem('merchant_name', 'Administrator');

        setIsAuthenticated(true);
        setMerchantInfo({
          merchant_id: 'admin',
          merchant_name: 'Administrator'
        });

        navigate('/terminal');
      } else {
        setError('Invalid credentials. Try "admin" / "password".');
      }
      setLoading(false);
    }, 500); // simulate loading
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("Registration is disabled in admin login mode.");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Payment Terminal</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="auth-toggle">
          <button className="active" disabled>
            Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin"
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
              placeholder="password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
