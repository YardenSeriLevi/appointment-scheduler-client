// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary'; // 1. ייבוא

function App() {
  return (
    <div>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        {/* 2. עטיפת החלק הדינמי עם ErrorBoundary */}
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </ErrorBoundary>
      </Container>
    </div>
  );
}

export default App;