// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. ייבוא

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth(); // <-- 2. קבלת מצב ההתחברות ופונקציית ההתנתקות

  return (
    <AppBar position="static">
      <Toolbar>
        {/* ... לוגו ... */}
        <Box>
          {isAuthenticated ? (
            // 3. מה להציג אם המשתמש מחובר
            <>
              <Button color="inherit" component={RouterLink} to="/my-appointments">
                התורים שלי
              </Button>
              <Button color="inherit" onClick={logout}>
                התנתקות
              </Button>
            </>
          ) : (
            // 4. מה להציג אם המשתמש לא מחובר
            <>
              <Button color="inherit" component={RouterLink} to="/login">התחברות</Button>
              <Button color="inherit" component={RouterLink} to="/register">הרשמה</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;