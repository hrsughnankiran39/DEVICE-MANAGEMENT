import axios from 'axios';

const API_URL = 'http://localhost:5000/api';  // Backend API URL

// Handle user login
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error logging in';
    }
};

// Handle user signup
export const signup = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error signing up';
    }
};

// Fetch all devices
export const getDevices = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/devices`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching devices';
    }
};

// Fetch single device details
export const getDeviceById = async (id, token) => {
    try {
        const response = await axios.get(`${API_URL}/devices/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error fetching device details';
    }
};

// Add a new device
export const addDevice = async (deviceData, token) => {
    try {
        const response = await axios.post(`${API_URL}/devices`, deviceData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error adding device';
    }
};

// Update device information
export const updateDevice = async (id, deviceData, token) => {
    try {
        const response = await axios.put(`${API_URL}/devices/${id}`, deviceData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error updating device';
    }
};

// Delete a device
export const deleteDevice = async (id, token) => {
    try {
        const response = await axios.delete(`${API_URL}/devices/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error deleting device';
    }
};
