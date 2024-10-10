import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Home() {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        const [coursesResponse, enrollmentsResponse] = await Promise.all([
          axios.get('http://localhost:3000/courses'),
          axios.get('http://localhost:3000/enrollments')
        ]);
        setCourses(coursesResponse.data);
        setEnrollments(enrollmentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoursesAndEnrollments();
  }, []);

  const isEnrolled = (courseId) => {
    return enrollments.some(enrollment => enrollment.course.id === courseId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item key={course.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#F5F5F5'
              }}
            >
              <CardMedia
                component="img"
                height="130"
                image={`data:image/jpeg;base64,${course.photo}`}
                alt={course.name}
              />
              <CardContent>
                <Box sx={{height:'140px'}}>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rs.{course.price}
                  </Typography>
                </Box>
                <Box sx={{ pt: 0, mt: 'auto', display: 'flex', alignItems: 'center' }}>
                  {isEnrolled(course.id) ? (
                    <TaskAltIcon sx={{ color: 'green', fontSize: 30 }} />
                  ) : (
                    <Button
                      component={Link}
                      to={`/course/${course.id}`}
                      variant="contained"
                    >
                      Learn More
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;