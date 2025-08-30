// src/components/FormField.js
import React from 'react';
import { TextField } from '@mui/material';

/**
 * רכיב גנרי עבור שדה קלט בטופס.
 * הוא מקבל props כדי שנוכל להתאים אותו לצרכים שונים.
 * @param {string} label - הטקסט שיוצג מעל השדה (לדוגמה: "שם מלא").
 * @param {string} type - סוג השדה (לדוגמה: 'text', 'email', 'password'). ברירת המחדל היא 'text'.
 * @param {string} name - השם של השדה, חשוב לניהול מצב הטופס.
 * @param {any} value - הערך הנוכחי של השדה (נשלט על ידי ה-state של הרכיב האב).
 * @param {function} onChange - פונקציה שתופעל בכל פעם שהערך בשדה משתנה.
 */
const FormField = ({ label, type = 'text', name, value, onChange, error = null, helperText = '' }) => {
  return (
    <TextField
      // Props שקיבלנו מהאב
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
            // Props חדשים להצגת שגיאות
      error={error} // מקבל true או false
      helperText={helperText} // הטקסט שיוצג מתחת לשדה

      // הגדרות עיצוב קבועות שאנחנו רוצים בכל שדה
      variant="outlined"
      fullWidth
      margin="normal"
    />
  );
};

export default FormField;