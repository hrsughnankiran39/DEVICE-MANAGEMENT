const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');
const deviceRoutes = require('./deviceRoutes')  // Import your authentication routes
const db = require('./deviceModel');         // Import the database connection

const app = express();

// Middleware
app.use(cors());                           // Allow cross-origin requests
app.use(bodyParser.json());                // Parse incoming JSON requests

// Use authentication routes
app.use('/api', authRoutes);
app.use('/api', deviceRoutes);

// Test route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the backend API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
