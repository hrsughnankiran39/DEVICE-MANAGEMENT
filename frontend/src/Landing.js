import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSignOutAlt,
  faPlus,
  faTrash,
  faChartPie,
  faList,
  faUser,
  faBuilding,
  faEnvelope,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import AddDevice from "./AddDevice";
import DeleteDevice from "./DeleteDevice";

Chart.register(PieController, ArcElement, Tooltip, Legend);

const Landing = () => {
  const [devices, setDevices] = useState([]);
  const [deviceMessage, setDeviceMessage] = useState("Fetching devices...");
  const [chartData, setChartData] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [showDeleteDevice, setShowDeleteDevice] = useState(false);
  const [status, setStatus] = useState("Checking...");
  const [tooltip, setTooltip] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [deviceCount, setDeviceCount] = useState(0); // Added state for device count
  const [isNotificationFetched, setIsNotificationFetched] = useState(false); // To track if notification data is fetched
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getalldevices");
        if (response.data && response.data.devices.length > 0) {
          setDevices(response.data.devices);
        } else {
          setDeviceMessage("No devices found.");
        }
      } catch (error) {
        setDeviceMessage("Error fetching devices.");
      }
    };
    fetchDevices();
  }, []);

  const fetchDeviceCounts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/devicescount");
      const data = response.data.counts;
      setChartData(data);

      if (chartInstance) {
        chartInstance.data.datasets[0].data = [
          data.countWithinOneHour,
          data.countBeforeOneHour,
        ];
        chartInstance.update();
      } else {
        initializeChart(data);
      }
    } catch (error) {
      console.error("Error fetching device counts:", error);
    }
  };

  const fetchNotification = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getnotification");
      if (response.data.statusCode === 200) {
        setDeviceCount(response.data.deviceCount); // Update device count
      }
    } catch (error) {
      console.error("Error fetching notification:", error);
    }
  };

  const initializeChart = (data) => {
    const ctx = document.getElementById("deviceChart").getContext("2d");
    const newChartInstance = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Created within the last hour", "Created before one hour"],
        datasets: [
          {
            label: "Device Count",
            data: [data.countWithinOneHour, data.countBeforeOneHour],
            backgroundColor: ["#4CAF50", "#FF5722"],
            borderColor: ["#4CAF50", "#FF5722"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
    setChartInstance(newChartInstance);
  };

  useEffect(() => {
    fetchDeviceCounts();
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/healthcheck");
        if (response.data.statusCode === 200) {
          setStatus("Active");
          setTooltip("API is running and database connection is healthy");
        } else {
          setStatus("Deactive");
          setTooltip("API is down or database connection is unhealthy");
        }
      } catch (error) {
        setStatus("Deactive");
        setTooltip("Failed to connect to the API or database");
      }
    };
    checkHealth();
  }, []);

  useEffect(() => {
    if (!isNotificationFetched) {
      fetchNotification(); // Fetch notification data on component load
      setIsNotificationFetched(true); // Set flag to true to prevent multiple calls
    }
  }, [isNotificationFetched]);

  const toggleAddDevice = () => {
    setShowAddDevice((prev) => !prev);
    setShowDeleteDevice(false);
  };

  const toggleDeleteDevice = () => {
    setShowDeleteDevice((prev) => !prev);
    setShowAddDevice(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>DEVICES INFO</h1>
      <div style={styles.header}>
        <p style={styles.greeting}>
          Hello, <span style={styles.username}>{username}</span>!
        </p>
        <p
          style={status === "Active" ? styles.activeStatus : styles.deactiveStatus}
          title={tooltip}
        >
          {status}
        </p>
        <div>
  <div style={styles.notificationContainer}>
    <FontAwesomeIcon
      icon={faBell}
      style={styles.notificationIcon}
      title="Notifications"
      onClick={fetchNotification}
    />
    {deviceCount > 0 && <span style={styles.badge}>{deviceCount}</span>} {/* Badge for count */}
  </div>
  {/* Other content and components */}
</div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
      <div style={styles.columns}>
      <div style={styles.column}>
  <h2 style={styles.columnHeader}>
    <FontAwesomeIcon icon={faList} /> Devices
  </h2>
  <div style={styles.deviceListContainer}>
    {devices.length > 0 ? (
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeader}>Device ID</th>
            <th style={styles.tableHeader}>Created By</th>
            <th style={styles.tableHeader}>Created Time</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, index) => (
            <tr key={index} style={styles.tableRow}>
              <td style={styles.tableCell}>{device.device_id}</td>
              <td style={styles.tableCell}>{device.created_by}</td>
              <td style={styles.tableCell}>
                {new Date(device.created_time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>{deviceMessage}</p>
    )}
  </div>
</div>

        <div style={styles.columns}>
          <div style={styles.column}>
            <h2 style={styles.columnHeader}>
              <FontAwesomeIcon icon={faPlus} /> Actions
            </h2>
            <div style={styles.actionButtonsContainer}>
              <button style={styles.actionButton} onClick={toggleAddDevice}>
                <FontAwesomeIcon icon={faPlus} /> Add Device
              </button>
              <button style={styles.actionButton} onClick={toggleDeleteDevice}>
                <FontAwesomeIcon icon={faTrash} /> Delete Device
              </button>
            </div>
            {showAddDevice && <AddDevice />}
            {showDeleteDevice && <DeleteDevice />}
          </div>
        </div>
        <div style={styles.column}>
          <h2 style={styles.columnHeader}>
            <FontAwesomeIcon icon={faChartPie} /> Device Count
          </h2>
          <div
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <canvas id="deviceChart"></canvas>
          </div>
        </div>
      </div>
      <div style={styles.contactDetails}>
        <p style={styles.contactInfo}>
          <FontAwesomeIcon icon={faUser} style={styles.icon} /> Sughnan H R,{" "}
          <FontAwesomeIcon icon={faBuilding} style={styles.icon} /> Alten GT,{" "}
          <FontAwesomeIcon icon={faEnvelope} style={styles.icon} /> hrsughnankiran389@gmail.com,{" "}
          <FontAwesomeIcon icon={faPhoneAlt} style={styles.icon} /> 9480146265
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#1a202c", // Dark navy blue background
    padding: "20px",
    color: "#f6e58d", // Yellow text
    fontFamily: "'Roboto', sans-serif",
  },
  heading: {
    fontSize: "2.5rem",
    color:"#ffffff",
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: "20px",
  },
  statusAndLogout: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginTop: "-39px",
  },
  greeting: {
    fontSize: "1.2rem",
    color: "#f6e58d",
    flexGrow: 1, // This allows it to take up available space
    textAlign: "center", // Centering the text horizontally
    marginLeft: "800px",
    marginTop: "-39px", // Adjust this value to move it further right
  },
  
  notificationContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginRight: "20px",
    marginTop: "-39px",
  },
  notificationIcon: {
    fontSize: "1.5rem",
    color: "#f6e58d",
    cursor: "pointer",
    marginTop: "0px",
    position: "relative",
  },
  notificationMessage: {
    position: "absolute",
    top: "30px",
    right: "0",
    backgroundColor: "#2d3748",
    color: "#f6e58d",
    padding: "10px",
    borderRadius: "5px",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  badge: {
    position: "absolute",
    top: "-3px", // Adjust the vertical position
    right: "-6px", // Adjust the horizontal position
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: "0.6rem", // Smaller font size for the badge
    fontWeight: "bold",
    padding: "1px 4px", // Smaller padding for a smaller badge
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px", // Explicit width for the badge
    height: "14px", // Explicit height for the badge
    transform: "scale(1.0)", // Reduce the badge size to half
    zIndex: 1, // Ensure it appears above other elements
  },
  
  activeStatus: {
    fontSize: "1.2rem",
    color: "#38a169",
    fontWeight: "bold",
    marginRight: "20px",// Adjust this to bring the status a little left
    display: "inline-block",
    marginTop: "-39px", // Ensures that both status and notification icon stay in the same row
  },
  
  deactiveStatus: {
    fontSize: "1rem",
    color: "#e53e3e",
    fontWeight: "bold",
  },
  logoutButton: {
    width: "120px",
    height: "40px",
    fontSize: "1rem",
    color: "#f6e58d",
    backgroundColor: "#ff7f50", // Coral button for better contrast
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
    marginTop: "-39px",
  },
  columns: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    marginTop: "20px",
  },
  column: {
    flex: 1,
    margin: "0 15px",
    textAlign: "center",
    color: "#f6e58d",
  },
  columnHeader: {
    color: "#C0C0C0", // Silver color for the header text
  },
  deviceListContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    backgroundColor: "#2d3748",
    padding: "10px",
    borderRadius: "8px",
  },
  deviceItem: {
    backgroundColor: "#4a5568",
    color: "#f6e58d", // Ensure consistent yellow text
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  deviceItemText: {
    color: "#f6e58d", // Explicitly set yellow text for all child elements
  },
  actionButton: {
    width: "200px", // Width for the button
    height: "40px", // Height for the button
    fontSize: "1.2rem", // Font size for button text
    color: "#f6e58d",
    backgroundColor: "#ff7f50", // Coral button
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
    display: "flex", // Make the button a flex container
    alignItems: "center", // Center the content vertically
    justifyContent: "center", // Center the content horizontally
  },

  actionButtonsContainer: {
    display: "flex",
    justifyContent: "space-between", // Align buttons in a row
    gap: "px8", // Reduced space between buttons
    marginBottom: "20px", // Keep margin below the row the same
  },

  actionButtonIcon: {
    fontSize: "1.1rem", // Font size for icons inside the button
    marginRight: "4px", // Space between the icon and the text
  },

  contactDetails: {
    marginTop: "90px", // Increased to push the entire section further down
    fontSize: "0.9rem",
    color: "#C0C0C0", // Uniform color for all text
    textAlign: "center",
    marginBottom: "0px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)", // Add shadow for better readability
  },

  contactInfo: {
    display: "flex",
    flexDirection: "row", // Horizontal layout
    justifyContent: "center",
    alignItems: "center",
    gap: "20px", // Larger space between each contact detail
    color: "#C0C0C0", // Ensures uniform color
    paddingTop: "10px", // Adds extra space above the content
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #000', // Line after column headings
  },
  tableHeader: {
    padding: '0.8rem',
    fontWeight: 'bold',
    textAlign: 'left',
    borderRight: '1px solid #ddd', // Line between columns
  },
  tableRow: {
    borderBottom: '1px solid #ddd', // Line between rows
  },
  tableCell: {
    padding: '0.8rem',
    borderRight: '1px solid #ddd', // Line between columns
    verticalAlign: 'middle',
  },

  icon: {
    marginRight: "4px", // Reduced space between icon and text
    color: "#C0C0C0", // Match icon color to text color
    fontSize: "1.2rem", // Slightly larger icon size for emphasis
  },
};
export default Landing;

