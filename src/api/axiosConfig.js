// src/api/axiosConfig.js
import axios from 'axios';

// יצירת מופע (instance) של axios עם הגדרות ברירת מחדל
const api = axios.create({
  // החליפי את הכתובת לכתובת המדויקת שבה ה-API שלך רץ
  // לדוגמה: https://localhost:7123
  baseURL: 'https://localhost:7111' 
});

export default api;