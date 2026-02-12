// Global Configuration for Smart Exam Management System

// Determine the backend API URL dynamically
// This allows the frontend to work on other devices by pointing to the host's IP address
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    const pathname = (window.location.pathname || '').toLowerCase();
    const port = pathname.includes('officerincharge') ? '3001' : '3000';
    const resolvedHostname = hostname && hostname.length > 0 ? hostname : 'localhost';

    // If running on localhost or 127.0.0.1, stick to localhost
    if (resolvedHostname === 'localhost' || resolvedHostname === '127.0.0.1') {
        return `http://localhost:${port}`;
    }

    // If accessed via IP (e.g., 192.168.x.x), use that IP for the backend too
    return `http://${resolvedHostname}:${port}`;
};

const API_BASE_URL = getApiBaseUrl();
window.API_BASE_URL = API_BASE_URL;

console.log('Smart Exam Config Loaded. API Base URL:', API_BASE_URL);
