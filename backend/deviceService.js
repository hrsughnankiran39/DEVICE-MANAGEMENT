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
        const { creator } = filters; // Destructure filters to get creator
        let query = 'SELECT * FROM devices WHERE soft_delete = 0';
        const queryParams = [];
    
        if (creator) {
            query += ' AND created_by = ?'; // Filter based on creator
            queryParams.push(creator);
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
        const query = 'SELECT * FROM devices WHERE soft_delete = 0';
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
        const query = 'SELECT COUNT(*) AS deviceCount FROM devices WHERE soft_delete = 0'; // SQL query to count devices
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) return reject(err);
                resolve(result[0].deviceCount);  // Return the count of devices
            });
        });
    }

    static async addDevice(device_id, created_by) {
        return new Promise((resolve, reject) => {
            // First, check if the device exists
            const checkQuery = 'SELECT soft_delete FROM devices WHERE device_id = ?';
            
            db.query(checkQuery, [device_id], (err, results) => {
                if (err) return reject(err);
    
                if (results.length > 0) {
                    const { soft_delete } = results[0];
    
                    if (soft_delete === 1) {
                        // If the device was soft deleted, reactivate it
                        const updateQuery = 'UPDATE devices SET soft_delete = 0, created_by = ?, created_time = CURRENT_TIMESTAMP WHERE device_id = ?';
                        db.query(updateQuery, [created_by, device_id], (err, result) => {
                            if (err) return reject(err);
                            resolve({ message: `Device ${device_id} restored successfully.` });
                        });
                    } else {
                        // Device already exists and is active
                        reject({ code: 'ER_DUP_ENTRY' });
                    }
                } else {
                    // If device does not exist, insert it
                    const insertQuery = 'INSERT INTO devices (device_id, created_by) VALUES (?, ?)';
                    db.query(insertQuery, [device_id, created_by], (err, result) => {
                        if (err) return reject(err);
                        resolve({ message: `Device ${device_id} added successfully.` });
                    });
                }
            });
        });
    }
    

    static async deleteDevice(device_id) {
        return new Promise((resolve, reject) => {
            // Check if the device exists and is already soft deleted
            const checkQuery = 'SELECT soft_delete FROM devices WHERE device_id = ?';
            
            db.query(checkQuery, [device_id], (err, results) => {
                if (err) return reject(err);
    
                if (results.length === 0 || results[0].soft_delete === 1) {
                    // If no record found or already soft deleted, return "not found"
                    return resolve({ affectedRows: 0 });
                }
    
                // Otherwise, perform the soft delete
                const updateQuery = 'UPDATE devices SET soft_delete = 1 WHERE device_id = ?';
                db.query(updateQuery, [device_id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });
    }
    
}

module.exports = DeviceService;
