import React, { useState } from 'react';
import { Button, Typography, Box, Container,Alert,IconButton } from '@mui/material';
import FormField from '../components/FormField';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext'; // <-- 1. ייבוא ה-Hook שלנו
import { useNavigate } from 'react-router-dom'; // ייבוא לניווט לאחר התחברות

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const LoginPage = () => {
  const { login } = useAuth(); // <-- 2. קבלת פונקציית ה-login מה-Context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "אימייל הוא שדה חובה.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "כתובת אימייל אינה תקינה.";
    }
    if (!formData.password) {
      tempErrors.password = "סיסמה היא שדה חובה.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "הסיסמה חייבת להכיל לפחות 6 תווים.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (validate()) {
      setIsLoading(true);
      
      // 3. שימוש בפונקציית ה-login מה-Context
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login successful');
        // 4. ניווט לדף הבית לאחר התחברות מוצלחת
        navigate('/');
      } else {
        console.error('Login failed:', result.error);
        setApiError(result.error);
      }

      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">התחברות</Typography>

        {apiError && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{apiError}</Alert>}
        {successMessage && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{successMessage}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormField
            label="כתובת אימייל"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormField
            label="סיסמה"
            name="password"
            // שינוי ה-type בהתאם למצב הנראות
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            // הוספת אייקון העין
            endAdornment={
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? 'מחובר...' : 'התחבר'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;