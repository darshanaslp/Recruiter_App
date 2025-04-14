import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if necessary
});

// Add a request interceptor to attach the token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Assume token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
