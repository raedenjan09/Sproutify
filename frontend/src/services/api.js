import axios from 'axios';

// Use your computer's local IP address instead of localhost for physical devices
// Make sure your phone is on the same Wi-Fi network
const API_URL = 'http://192.168.0.104:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to log errors
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default api;
