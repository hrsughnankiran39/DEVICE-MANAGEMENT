import React, { useState } from 'react';
import axios from 'axios';

const HealthCheck = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleHealthCheck = async () => {
    setLoading(true);
    setResponse(''); // Clear previous response before starting a new check
    try {
      const result = await axios.get('http://localhost:5000/api/healthcheck');
      setResponse(result.data.message || 'Health Check Passed!');
    } catch (error) {
      setResponse('Health Check Failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Health Check</h2>
      <button onClick={handleHealthCheck} disabled={loading}>
        {loading ? 'Checking...' : 'Check Health'}
      </button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default HealthCheck;
