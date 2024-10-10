import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import CourseDetail from './Pages/CourseDetails';
import Checkout from './Pages/Checkout';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import { Box } from '@mui/material';
import './App.css'
import EnrolledCourses from './Pages/EnrolledCourses';

const theme = createTheme({
  palette: {
    primary: {
      main: '#198754',
    },
    secondary: {
      main: '#4338CA',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', }}>
          <Header />
          <Box style={{ flex: 1}}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/enrolled-courses" element={<EnrolledCourses />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;