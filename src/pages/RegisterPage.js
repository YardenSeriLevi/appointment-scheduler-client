// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import FormField from '../components/FormField'; // ייבוא הרכיב המותאם אישית שלנו

const RegisterPage = () => {
  /**
   * ניהול המצב (State) של כל שדות הטופס.
   * `formData` הוא אובייקט שמחזיק את הערכים העדכניים של כל שדה.
   * `setFormData` היא הפונקציה שאנו משתמשים בה כדי לעדכן את המצב.
   * `useState` הוא Hook של ריאקט שמאתחל את המצב עם ערכים התחלתיים ריקים.
   */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  /**
   * פונקציה לביצוע וולידציה על שדות הטופס.   
   * היא בודקת אם השדות מלאים ואם האימייל תקין.
   * אם יש שגיאות, היא מעדכנת את ה-State של השג יאות.
   * @returns {boolean} - מחזירה true אם כל השדות תקינים, אחרת false.
   */
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
    
    // הפונקציה תחזיר true אם אין שגיאות, ו-false אם יש
    return Object.keys(tempErrors).length === 0;
  };

  /**
   * פונקציה המופעלת בכל שינוי באחד משדות הטופס (למשל, הקלדה).
   * היא אחראית על עדכון ה-State עם הערך החדש שהוזן.
   * @param {React.ChangeEvent<HTMLInputElement>} event - אובייקט האירוע מהדפדפן.
   */
  const handleChange = (event) => {
    // פירוק (Destructuring) של המאפיינים name ו-value מתוך אלמנט ה-input
    const { name, value } = event.target;
    
    // עדכון ה-State.
    // `prevState` הוא המצב הקודם של האובייקט.
    // `...prevState` (Spread Operator) יוצר עותק של כל המאפיינים הקיימים.
    // `[name]: value` דורס באופן דינמי את הערך של השדה שהשתנה.
    // לדוגמה, אם השינוי היה בשדה ה'email', זה יתורגם ל- { ...prevState, email: 'new value' }
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  /**
   * פונקציה המופעלת כאשר המשתמש לוחץ על כפתור ההרשמה.
   * היא מונעת את ההתנהגות המחדלית של הטופס (שליחה מחדש של הדף),
   * מבצעת וולידציה, ואם הכל תקין, מדפיסה את הנתונים לקונסול.
   * @param {React.FormEvent<HTMLFormElement>} event - אובייקט האירוע מהדפדפן.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) { // אם הוולידציה עברה בהצלחה
      console.log('Form data submitted:', formData);
      // כאן נשלח את הנתונים ל-API
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          הרשמה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
         <FormField
        label="שם מלא"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={!!errors.fullName} // !! הופך את הטקסט ל-boolean (true אם יש שגיאה, false אם אין)
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
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
        helperText={errors.password}
      />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            הירשם
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;