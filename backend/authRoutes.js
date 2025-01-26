const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./deviceModel'); // MySQL database connection

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the email already exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error("Error checking user existence:", err);
            return res.status(500).json({ message: 'Error checking user existence' });
        }

        // If the user already exists
        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password before saving it in the database
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).json({ message: 'Error inserting user' });
                }

                // Send success response
                res.status(201).json({ message: 'User created successfully' });
            });
        } catch (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: 'Error hashing password' });
        }
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ message: 'Error fetching user' });
        }

        // If user not found
        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result[0];

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            // If passwords do not match
            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrect password' });
            }

            // Create JWT token for the user
            const token = jwt.sign({ userId: user.user_id }, 'your_secret_key', { expiresIn: '1h' });

            // Send success response with the JWT token
            res.status(200).json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;
