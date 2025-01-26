import React, { useState } from 'react';
import axios from 'axios';

const GetAllDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetAllDevices = async () => {
    setLoading(true);
    setError(null); // Reset error state on new fetch attempt
    try {
      const result = await axios.get('http://localhost:5000/api/getalldevices');
      console.log('Raw response from backend:', result.data); // Debug raw response
      
      // Extract the devices array from the response
      if (result.data && Array.isArray(result.data.devices)) {
        setDevices(result.data.devices);
      } else {
        console.warn('Unexpected response format:', result.data);
        setError('Unexpected response format from server.');
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>All Devices</h2>
      <button onClick={handleGetAllDevices} disabled={loading}>
        {loading ? 'Fetching Devices...' : 'Fetch Devices'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {devices.length === 0 ? (
          <li>No devices available.</li>
        ) : (
          devices.map((device, index) => (
            <li key={device.id}>
              <strong>Device ID:</strong> {device.device_id} <br />
              <strong>Created By:</strong> {device.created_by} <br />
              <strong>Created Time:</strong> {new Date(device.created_time).toLocaleString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GetAllDevices;
