import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotifications } from '../services/api';
import '../styles/Notifications.css';

const Notifications = ({ merchantInfo }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await getNotifications();
        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
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
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>MTI Notifications</h1>
        <div className="merchant-info">
          <span>Welcome, {merchantInfo?.merchant_name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      <div className="notifications-content">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading notifications...</div>
        ) : (
          <div className="card">
            <h2>Recent MTI Notifications</h2>
            
            {notifications.length === 0 ? (
              <p>No notifications found</p>
            ) : (
              <div className="notifications-list">
                {notifications.map((notification) => {
                  const messageData = JSON.parse(notification.message);
                  return (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.processed ? '' : 'new'}`}
                    >
                      <div className="notification-header">
                        <span className="mti-code">{messageData.mti}</span>
                        <span className="notification-timestamp">
                          {formatDate(notification.timestamp)}
                        </span>
                      </div>
                      <div className="notification-description">
                        {messageData.description}
                      </div>
                      <div className="notification-details">
                        <p><strong>Transaction ID:</strong> {messageData.transaction_id}</p>
                        {messageData.status && (
                          <p><strong>Status:</strong> 
                            <span className={`status-${messageData.status.toLowerCase()}`}>
                              {messageData.status}
                            </span>
                          </p>
                        )}
                        {messageData.approval_code && (
                          <p><strong>Approval Code:</strong> {messageData.approval_code}</p>
                        )}
                        {messageData.response_code && (
                          <p><strong>Response Code:</strong> {messageData.response_code}</p>
                        )}
                        {messageData.response_message && (
                          <p><strong>Response Message:</strong> {messageData.response_message}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;