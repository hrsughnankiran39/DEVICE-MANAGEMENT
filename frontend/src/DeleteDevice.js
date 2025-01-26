import React, { useState } from "react";
import axios from "axios";
import "./DeleteDevice.css";

const DeleteDevice = () => {
  const [deviceId, setDeviceId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteDevice = async () => {
    if (!deviceId.trim()) {
      setResponse("Please enter a device ID.");
      return;
    }

    // Show confirmation dialog
    const confirmDeletion = window.confirm(
      `Are you sure you want to delete the device with ID: ${deviceId}?`
    );
    if (!confirmDeletion) {
      return; // Exit if the user cancels the action
    }

    setLoading(true);
    setResponse("");
    try {
      // Send POST request with device_id in the body
      const result = await axios.post("http://localhost:5000/api/deletedevice", {
        device_id: deviceId, // Passing device_id in the request body
      });

      // Set response message
      setResponse(result.data.message || "Device Deleted Successfully!");
      setDeviceId(""); // Clear input field after successful deletion

      // Trigger page reload after 3 seconds (optional)
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      setResponse(
        error.response?.data?.message || "Failed to Delete Device! Please try again."
      );
      setDeviceId(""); // Optionally clear device ID on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-device-container">
      <h2>Delete Device</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="deviceId">Device ID:</label>
        <input
          type="text"
          id="deviceId"
          placeholder="Enter Device ID to delete"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
        />
        <button
          type="button"
          onClick={handleDeleteDevice}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Device"}
        </button>
      </form>
      {response && <p className="response-message">{response}</p>}
    </div>
  );
};

export default DeleteDevice;
