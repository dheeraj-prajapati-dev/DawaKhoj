import axios from 'axios';

const API = axios.create({
  // Check if we are running locally or on production
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://dawakhoj.onrender.com/api',
  withCredentials: true, // 🔥 Har request ke saath cookies bhejne ke liye
});

// Request Interceptor (Optional: Logging ke liye)
API.interceptors.request.use((config) => {
  console.log(`🚀 Sending request to: ${config.baseURL}${config.url}`);
  return config;
});

// Response Interceptor: Agar 401 aaye toh user ko logout karwane ke liye
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Session expired or unauthorized. Clearing state...");
      // Yahan aap window.location.href = '/login' bhi daal sakte hain
    }
    return Promise.reject(error);
  }
);

export default API;