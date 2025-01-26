const db = require('./deviceModel');  // Correct import since it's in the same directory

class DeviceService {
    static async healthCheck() {
        return new Promise((resolve, reject) => {
            // Ping the database with a simple query
            db.query('SELECT 1', (err, results) => {
                if (err) {
                    // If there is an error (e.g., database connection failed)
                    return reject(new Error('Database connection failed: ' + err.message));
                }
                // If no error, resolve the promise indicating the DB is healthy
                resolve('API is running and database connection is healthy');
            });
        });
    }
    static async getAllDevices(filters = {}) {
        const { creator, startDate, endDate } = filters; // Destructure filters
        let query = 'SELECT * FROM devices';
        const queryParams = [];
    
        if (creator || startDate || endDate) {
            const conditions = [];
    
            if (creator) {
                conditions.push('created_by = ?');
                queryParams.push(creator);
            }
    
            if (startDate) {
                conditions.push('DATE(created_time) >= ?');
                queryParams.push(startDate);
            }
    
            if (endDate) {
                conditions.push('DATE(created_time) <= ?');
                queryParams.push(endDate);
            }
    
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
    
        query += ' ORDER BY created_time DESC';
    
        return new Promise((resolve, reject) => {
            db.query(query, queryParams, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    

    static async getDeviceCount() {
        const query = 'SELECT * FROM devices';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
    
                // Get today's date without time (00:00:00)
                const today = new Date();
                today.setHours(0, 0, 0, 0);  // Set time to 00:00:00 for today
    
                let countWithinOneHour = 0;
                let countBeforeOneHour = 0;
    
                results.forEach(device => {
                    const deviceTime = new Date(device.created_time);
    
                    // If the device was created today, consider it for countBeforeOneHour
                    if (deviceTime >= today) {
                        const currentTime = new Date().getTime();
                        const timeDifference = currentTime - deviceTime.getTime();
    
                        // Devices created within the last hour
                        if (timeDifference <= 60 * 60 * 1000) {
                            countWithinOneHour++;
                        } else {
                            // Devices created today but not in the last hour
                            countBeforeOneHour++;
                        }
                    }
                });
    
                resolve({ countWithinOneHour, countBeforeOneHour });
            });
        });
    }
    

    // Add this method to get the notification count (number of devices)
    static async getNotificationCount() {
        const query = 'SELECT COUNT(*) AS deviceCount FROM devices';  // SQL query to count devices
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) return reject(err);
                resolve(result[0].deviceCount);  // Return the count of devices
            });
        });
    }

    static async addDevice(device_id, created_by) {
        const query = 'INSERT INTO devices (device_id, created_by) VALUES (?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [device_id, created_by], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }

    static async deleteDevice(device_id) {
        const query = 'DELETE FROM devices WHERE device_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [device_id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }
}

module.exports = DeviceService;
