import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/devices', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setDevices(response.data);
          setLoading(false);
        })
        .catch(error => {
          setError('Failed to fetch devices. Please try again.');
          setLoading(false);
        });
    } else {
      setError('No authentication token found.');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading devices...</div>;
  }

  return (
    <div>
      <h2>Devices</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {devices.length === 0 ? (
        <p>No devices available.</p>
      ) : (
        <ul>
          {devices.map(device => (
            <li key={device.id}>
              {device.name} - {device.model}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Devices;
