import React, { useEffect, useState } from 'react';
import './ProtocolSelector.css';

const ProtocolSelector = ({ onSelect }) => {
  const [protocols, setProtocols] = useState({});
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const response = await fetch('/api/protocols', {
          credentials: 'include', // send cookies/session info if needed
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setProtocols(data.protocols);
          setError(null);
        } else {
          setError('Failed to load protocols');
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedProtocol(value);
    if (onSelect) onSelect(value);
  };

  if (loading) return <div>Loading protocols...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="protocol-container">
      <label htmlFor="protocol">Protocol</label>
      <select
        id="protocol"
        value={selectedProtocol}
        onChange={handleChange}
        className="protocol-select"
      >
        <option value="">Select a protocol</option>
        {Object.entries(protocols).map(([label, value]) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProtocolSelector;

