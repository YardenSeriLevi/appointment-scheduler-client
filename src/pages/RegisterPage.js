import React, { useState } from 'react';
import { Button, Typography, Box, Container,Alert,IconButton } from '@mui/material';
import FormField from '../components/FormField';
import api from '../api/axiosConfig';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
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
    if (!formData.fullName) tempErrors.fullName = "שם מלא הוא שדה חובה.";
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
    setSuccessMessage(''); // נאפס גם הודעת הצלחה קודמת

    if (validate()) {
      setIsLoading(true);
      try {
        const response = await api.post('/api/auth/register', formData);
        console.log('Registration successful:', response.data);
        setSuccessMessage('ההרשמה בוצעה בהצלחה! כעת תוכל להתחבר.');
        setFormData({ fullName: '', email: '', password: '' });
      } catch (error) {
        console.error('Registration failed:', error);
        if (error.response && error.response.data) {
          setApiError(error.response.data);
        } else {
          setApiError('אירעה שגיאה. אנא נסה שוב מאוחר יותר.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">הרשמה</Typography>

        {apiError && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{apiError}</Alert>}
        {successMessage && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{successMessage}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormField
            label="שם מלא"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
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
            {isLoading ? 'נרשם...' : 'הירשם'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
