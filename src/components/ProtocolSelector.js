import React, { useState } from 'react';
import './ProtocolSelector.css'; // Optional for styling

const ProtocolSelector = ({ onSelect }) => {
  const [selectedProtocol, setSelectedProtocol] = useState('');

  const PROTOCOLS = {
    "POS Terminal -101.1 (4-digit approval)": 4,
    "POS Terminal -101.4 (6-digit approval)": 6,
    "POS Terminal -101.6 (Pre-authorization)": 6,
    "POS Terminal -101.7 (4-digit approval)": 4,
    "POS Terminal -101.8 (PIN-LESS transaction)": 4,
    "POS Terminal -201.1 (6-digit approval)": 6,
    "POS Terminal -201.3 (6-digit approval)": 6,
    "POS Terminal -201.5 (6-digit approval)": 6
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedProtocol(value);
    if (onSelect) onSelect(value);
  };

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
        {Object.entries(PROTOCOLS).map(([label, value]) => (
          <option key={label} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProtocolSelector;
