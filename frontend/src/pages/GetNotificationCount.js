import React, { useState } from 'react';
import axios from 'axios';

const GetNotificationCount = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetNotificationCount = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      // Corrected API endpoint
      const result = await axios.get('http://localhost:5000/api/getnotification');
      // Corrected response field
      setCount(result.data.deviceCount);
    } catch (error) {
      setError('Error fetching notification count');
      setCount(null); // Reset count in case of an error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Notification Count</h2>
      <button onClick={handleGetNotificationCount} disabled={loading}>
        {loading ? 'Fetching Count...' : 'Get Notification Count'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {count !== null && !error && <p>Total Notifications: {count}</p>}
    </div>
  );
};

export default GetNotificationCount;
