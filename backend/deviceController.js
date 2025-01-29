const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const DeviceService = require('./deviceService'); // Correct import since it's in the same directory

class DeviceController {
    static async healthCheck(req, res) {
        try {
            const message = await DeviceService.healthCheck();
            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message,
            });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                error: err.message,
            });
        }
    }

    static async getAllDevices(req, res) {
        try {
            const devices = await DeviceService.getAllDevices();
            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                devices,
            });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                error: err.message,
            });
        }
    }

    static async getDeviceCount(req, res) {
        try {
            const counts = await DeviceService.getDeviceCount();
            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                counts,
            });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                error: err.message,
            });
        }
    }

    static async getNotification(req, res) {
        try {
            const notificationCount = await DeviceService.getNotificationCount();
            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                deviceCount: notificationCount,
            });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                error: err.message,
            });
        }
    }

    static async addDevice(req, res) {
        const { device_id, created_by } = req.body;
        if (!device_id || !created_by) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                statusCode: StatusCodes.BAD_REQUEST,
                message: getReasonPhrase(StatusCodes.BAD_REQUEST),
            });
        }
    
        try {
            const result = await DeviceService.addDevice(device_id, created_by);
            res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                message: result.message,
            });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                res.status(StatusCodes.CONFLICT).json({
                    statusCode: StatusCodes.CONFLICT,
                    message: `Device ID ${device_id} already exists.`,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                    error: err.message,
                });
            }
        }
    }
    

    static async deleteDevice(req, res) {
        const { device_id } = req.body;
        if (!device_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                statusCode: StatusCodes.BAD_REQUEST,
                message: getReasonPhrase(StatusCodes.BAD_REQUEST),
            });
        }
    
        try {
            const result = await DeviceService.deleteDevice(device_id);
            if (result.affectedRows === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    statusCode: StatusCodes.NOT_FOUND,
                    message: `Device not found`,
                });
            }
            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message: `Device ${device_id} deleted successfully`,
            });
        } catch (err) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                error: err.message,
            });
        }
    }
    
}

module.exports = DeviceController;
