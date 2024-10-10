import React from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../Services/auth';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = getCurrentUser();

  // To handle navigation for the tabs
  const handleTabChange = (event, newValue) => {
    navigate(newValue);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            ClassPro
          </Typography>

          {isLoggedIn && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={location.pathname} // The current path as the value
                onChange={handleTabChange} // Function to handle tab change
                textColor="inherit"
                indicatorColor="secondary"
              >
                <Tab label="Home" value="/" />
                <Tab label="Enrolled Courses" value="/enrolled-courses" />
              </Tabs>
            </Box>
          )}

          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
