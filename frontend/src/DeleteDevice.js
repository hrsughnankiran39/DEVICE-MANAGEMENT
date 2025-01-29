import React, { useState } from "react";
import axios from "axios";
import "./DeleteDevice.css";

const DeleteDevice = () => {
  const [deviceId, setDeviceId] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteDevice = async () => {
    setLoading(true);
    setResponse("");
    try {
      const result = await axios.post("http://localhost:5000/api/deletedevice", {
        device_id: deviceId,
      });
      setResponse(result.data.message || "Device Deleted Successfully!");
      setDeviceId("");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      setResponse(
        error.response?.data?.message || "Failed to Delete Device! Please try again."
      );
    } finally {
      setLoading(false);
      setShowConfirm(false);
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
          onClick={() => setShowConfirm(true)}
          disabled={loading || !deviceId.trim()}
        >
          {loading ? "Deleting..." : "Delete Device"}
        </button>
      </form>
      {response && <p className="response-message">{response}</p>}

      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-box">
              <p>Are you sure you want to delete the device with ID: {deviceId}?</p>
              <button onClick={handleDeleteDevice} disabled={loading}>Yes, Delete</button>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteDevice;