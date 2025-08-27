// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            מערכת זימון תורים
          </RouterLink>
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/login">
            התחברות
          </Button>
          <Button color="inherit" component={RouterLink} to="/register">
            הרשמה
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;