// src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/courses/${id}`)
      .then(response => setCourse(response.data))
      .catch(error => console.error('Error fetching course details:', error));
  }, [id]);

  const handlePurchase = () => {
    navigate(`/checkout/${id}`);
  };

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',  // Full screen height
        bgcolor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          maxWidth: 'md', 
          width: '100%',
          maxHeight: '95vh',  // Max height of the card
          overflow: 'auto',   // Scroll if content exceeds the height
          bgcolor: '#F5F5F5',  // Card background color
          boxShadow: 3,       // Material UI shadow
          borderRadius: 2,    // Rounded corners
          p: 4,               // Padding inside the card
        }}
      >
        {/* Base64 Image */}
        <img 
          src={`data:image/jpeg;base64,${course.photo}`} 
          alt={course.title} 
          style={{ width: '100%', height: '50vh', marginBottom: '16px', objectFit: 'cover' }} 
        />

        {/* Course Title */}
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>

        {/* Course Description */}
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>

        {/* Course Price */}
        <Typography variant="h6" gutterBottom>
          Price: Rs. {course.price}
        </Typography>

        {/* Purchase Button */}
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handlePurchase}>
            Purchase
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default CourseDetail;