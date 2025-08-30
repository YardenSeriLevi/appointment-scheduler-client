// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// 1. ייבוא הכלים הדרושים מ-MUI ומהספרייה שהתקנו
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// 2. יצירת Theme (ערכת נושא) חדשה עם הגדרת כיווניות RTL
const theme = createTheme({
  direction: 'rtl',
});

// 3. הגדרת ה-cache עם הפלאגין של RTL
// החלק הזה הוא ה"קסם" שדואג להפוך את כל ה-CSS באופן אוטומטי
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 4. עטיפת כל האפליקציה ב-Providers */}
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);