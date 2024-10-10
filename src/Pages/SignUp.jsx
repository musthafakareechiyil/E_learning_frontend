// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signup } from '../Services/auth';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(username, password);
      navigate('/');
    } catch (err) {
      setError('Error creating account');
    }
  };

  return (
    <Box sx={styles.main}>
      <Box sx={styles.innerBox}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const styles = {
  main: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "2rem",
  },
  innerBox: {
    mt: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "25%",
    justifyContent: "center",
    border: "1px solid #C7C7C7",
    padding: "1rem",
    background: "#F5F5F5",
    borderRadius: "4px",
    height: '400px'
  },
};

export default SignUp;