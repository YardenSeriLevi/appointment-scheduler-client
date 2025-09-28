// src/api/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7111' // ודאי שזו הכתובת הנכונה
});

// הוספת "מיירט" (interceptor) שיפעל על כל בקשה יוצאת
api.interceptors.request.use(
  (config) => {
    // 1. קרא את הטוקן מה-localStorage
    const token = localStorage.getItem('jwt_token');
    
    // 2. אם הטוקן קיים, הוסף אותו להידרים
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;