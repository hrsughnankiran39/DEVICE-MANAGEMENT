const express = require('express');
const DeviceController = require('./deviceController');  // Adjusted path to backend folder
  // Adjusted path to backend folder

const router = express.Router();

// Device routes
router.get('/getalldevices', DeviceController.getAllDevices);
router.get('/devicescount', DeviceController.getDeviceCount);
router.post('/adddevice', DeviceController.addDevice);
router.post('/deletedevice', DeviceController.deleteDevice);
router.get('/getnotification', DeviceController.getNotification);
router.get('/healthcheck', DeviceController.healthCheck);


module.exports = router; // Export the router instance
