// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material'; // <-- 1. ייבוא Container
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar'; // <-- 2. ייבוא ה-Navbar

function App() {
  return (
    <div>
      <Navbar /> {/* <-- 3. הוספת ה-Navbar */}
      <Container sx={{ mt: 4 }}> {/* 4. עטיפת התוכן ב-Container */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;