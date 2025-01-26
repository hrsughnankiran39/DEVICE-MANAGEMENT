import React, { useState } from 'react';
import axios from 'axios';
import './AddDevice.css';

const AddDevice = () => {
  const [deviceId, setDeviceId] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem("username"); // Retrieve username from localStorage

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deviceId.trim()) {
      setResponse('Device ID field cannot be empty.');
      return;
    }

    setIsLoading(true); // Show loader or disable button
    try {
      await axios.post('http://localhost:5000/api/adddevice', {
        device_id: deviceId,
        created_by: username, // Use username from localStorage
      });
      setResponse('Device added successfully!');
      setDeviceId(''); // Clear input field
      window.location.reload(); // Reload page after successful submission
    } catch (error) {
      setResponse(
        error.response?.data?.message || 'Failed to add device! Please try again.'
      );
    } finally {
      setIsLoading(false); // Hide loader or enable button
    }
  };

  return (
    <div className="add-device-container">
      <h2>Add Device</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID:</label>
          <input
            id="deviceId"
            type="text"
            placeholder="Enter Unique Device ID"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Device'}
        </button>
      </form>
      {response && <p className="response-message">{response}</p>}
    </div>
  );
};

export default AddDevice;
