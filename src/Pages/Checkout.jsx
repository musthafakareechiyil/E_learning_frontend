import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';
import { getCurrentUser } from '../Services/auth';

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

function Checkout() {
  const [course, setCourse] = useState(null);
  const [installments, setInstallments] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!getCurrentUser()) {
      navigate('/login');
    }
    axios.get(`http://localhost:3000/courses/${id}`)
      .then(response => setCourse(response.data))
      .catch(error => console.error('Error fetching course details:', error));
  }, [id, navigate]);

  const handleInstallmentsChange = (event) => {
    setInstallments(event.target.value);
  };

  const handleCheckout = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
  
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
  
    // Calculate first installment amount in paise
    const amountInPaise = (course.price / installments) * 100;
  
    const options = {
      key: 'rzp_test_gpnWAbxaa8RUyY',
      amount: amountInPaise.toString(),  // Pass the first installment amount
      currency: 'INR',
      name: 'ClassPro',
      description: `Payment for ${course.title}`,
      handler: async function (response) {
        const data = {
          course_id: course.id,
          number_of_installments: installments,
          amount_paid: course.price / installments  // Send the first installment amount
        };
  
        // Send the data to the enrollments API
        const result = await axios.post('http://localhost:3000/enrollments', data);
        alert(result.data.msg);
        navigate('/');
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#61dafb',
      },
    };
  
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  
  
  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Typography variant="h6" gutterBottom>{course.title}</Typography>
      <Typography variant="body1" gutterBottom>Price: Rs.{course.price}</Typography>
      <Box sx={{ mt: 4 }}>
        <TextField
          type="number"
          label="Number of Installments"
          value={installments}
          onChange={handleInstallmentsChange}
          fullWidth
          margin="normal"
          InputProps={{ inputProps: { min: 1 } }}
        />
        <Typography variant="body1" gutterBottom>
          Installment Amount: Rs. {(course.price / installments).toFixed(2)}
        </Typography>
        <Button variant="contained" onClick={handleCheckout} sx={{ mt: 2 }}>
          Proceed to Payment
        </Button>
      </Box>
    </Container>
  );
}

export default Checkout;
