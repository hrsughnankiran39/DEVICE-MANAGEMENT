import React, { useState } from 'react';
import axios from 'axios';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const GetDevicesCount = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);

  const handleGetDevicesCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get('http://localhost:5000/api/devicescount');
      const data = result.data.counts;
      setCounts(data);

      // Update the chart
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
      setError('Error fetching counts');
      setCounts(null);
    } finally {
      setLoading(false);
    }
  };

  const initializeChart = (data) => {
    const ctx = document.getElementById('deviceChart').getContext('2d');
    const newChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Created within the last hour', 'Created before one hour'],
        datasets: [
          {
            label: 'Device Count',
            data: [data.countWithinOneHour, data.countBeforeOneHour],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Allow control over the height and width
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      },
    });
    setChartInstance(newChartInstance);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Devices Count</h2>
      <button onClick={handleGetDevicesCount} disabled={loading}>
        {loading ? 'Fetching Counts...' : 'Get Counts'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {counts && (
        <div>
          <p>Devices created within one hour: {counts.countWithinOneHour}</p>
          <p>Devices created before one hour today: {counts.countBeforeOneHour}</p>
        </div>
      )}
      {/* Chart container with styling for controlled size */}
      <div
        style={{
          width: '80vw', // Adjust to fit the screen width
          maxWidth: '500px', // Limit the maximum width
          height: '300px', // Adjust the height
          margin: '0 auto', // Center the chart
        }}
      >
        <canvas id="deviceChart"></canvas>
      </div>
    </div>
  );
};

export default GetDevicesCount;
