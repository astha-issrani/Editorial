import axios from 'axios';

const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'https://editorial-xzlh.onrender.com/api'  // ← add this
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('editorial_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;