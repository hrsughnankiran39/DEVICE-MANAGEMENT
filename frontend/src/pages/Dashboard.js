import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>WELCOME TO API ASSIGNMENT</h1>
      <div className="buttons-container">
        <Link to="/healthcheck">
          <button className="dashboard-button">Health Check</button>
        </Link>
        <Link to="/getalldevices">
          <button className="dashboard-button">Get All Devices</button>
        </Link>
        <Link to="/getdevicescount">
          <button className="dashboard-button">Get Devices Count</button>
        </Link>
        <Link to="/getnotificationcount">
          <button className="dashboard-button">Get Notification Count</button>
        </Link>
        <Link to="/adddevice">
          <button className="dashboard-button">Add Device</button>
        </Link>
        <Link to="/deletedevice">
          <button className="dashboard-button">Delete Device</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
