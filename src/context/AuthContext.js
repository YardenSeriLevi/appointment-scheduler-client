// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import api from '../api/axiosConfig';

// 1. יצירת ה-Context עצמו
const AuthContext = createContext(null);

// 2. יצירת ה-"Provider" - רכיב שיעטוף את האפליקציה ויספק את המידע
export const AuthProvider = ({ children }) => {
  // State שיחזיק את הטוקן. אנחנו מנסים לקרוא אותו מ-localStorage בהתחלה
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));

  /**
   * פונקציה להתחברות. היא מקבלת אימייל וסיסמה,
   * שולחת אותם ל-API, ובמקרה של הצלחה, שומרת את הטוקן.
   */
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const newToken = response.data.token; // ודאי שהשרת מחזיר אובייקט עם שדה 'token'
      setToken(newToken);
      localStorage.setItem('jwt_token', newToken);
      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage = error.response?.data || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * פונקציה להתנתקות. מנקה את הטוקן מה-State ומה-localStorage.
   */
  const logout = () => {
    setToken(null);
    localStorage.removeItem('jwt_token');
  };

  // 3. הכנת הערך שייחשף לכל הרכיבים
  // אנחנו חושפים את הטוקן (כדי לדעת אם מחוברים) ואת פונקציות הפעולה
  const value = {
    token,
    login,
    logout,
    isAuthenticated: !!token, // משתנה בוליאני נוח לשימוש
  };

  // 4. החזרת רכיב ה-Provider שעוטף את הילדים (כל האפליקציה)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. יצירת Custom Hook לשימוש נוח ב-Context
export const useAuth = () => {
  return useContext(AuthContext);
};