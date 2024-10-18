import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, CardMedia, Container, Grid, Drawer, Accordion, AccordionSummary, AccordionDetails, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import axios from 'axios';

function EnrolledCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [paymentState, setPaymentState] = useState({
    selectedInstallment: null,
    payNowEnabled: true,
    selectedOption: 'add_to_next',
    amount: 0,
    amountError: false,
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/enrollments');
      setEnrollments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDrawer = (enrollment) => {
    const firstUnpaidInstallment = enrollment.installments.find(inst => inst.status !== 'paid');
    setSelectedEnrollment(enrollment);
    setDrawerOpen(true);
    if (firstUnpaidInstallment) {
      const totalPaid = enrollment.installments.reduce((acc, inst) => acc + (inst.status === 'paid' ? inst.amount_paid : 0), 0);
      const totalDueAmount = enrollment.course.price - totalPaid;

      setPaymentState({
        selectedInstallment: firstUnpaidInstallment,
        payNowEnabled: true,
        selectedOption: 'add_to_next',
        amount: firstUnpaidInstallment.amount_due,
        amountError: false,
        totalDueAmount,
      });
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEnrollment(null);
    setPaymentState({
      selectedInstallment: null,
      payNowEnabled: true,
      selectedOption: 'add_to_next',
      amount: 0,
      amountError: false,
    });
  };

  const handleAmountChange = (amount) => {
    const amountValue = parseFloat(amount);
    const totalDueAmount = paymentState.totalDueAmount;

    // If amount exceeds total due, show error and disable Pay Now
    if (amountValue > totalDueAmount) {
      setPaymentState((prevState) => ({
        ...prevState,
        amountError: true,
        payNowEnabled: false,
        amount: amountValue,
      }));
    } else {
      setPaymentState((prevState) => ({
        ...prevState,
        amountError: false,
        payNowEnabled: amountValue > 0,
        selectedOption: amountValue >= prevState.selectedInstallment.amount_due ? prevState.selectedOption : 'add_to_next',
        amount: amountValue,
      }));
    }
  };

  const handleOptionChange = (event) => {
    setPaymentState((prevState) => ({
      ...prevState,
      selectedOption: event.target.value,
    }));
  };

  const loadScript = (src) => {
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
  };

  const handlePayNow = async () => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const options = {
      key: 'rzp_test_gpnWAbxaa8RUyY',
      amount: (paymentState.amount * 100).toString(),
      currency: 'INR',
      name: 'ClassPro',
      description: `Payment for ${selectedEnrollment.course.name}`,
      handler: async function (response) {
        try {
          const result = await axios.post(`http://localhost:3000/installments/${paymentState.selectedInstallment.id}/pay_installment`, {
            amount_paid: paymentState.amount,
            user_choice: paymentState.selectedOption
          });
          alert(result.data.msg);
          fetchEnrollments();
          handleCloseDrawer();
        } catch (error) {
          alert(error.response?.data?.error || 'Payment processing failed');
        }
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {enrollments.map((enrollment) => {
          const allPaid = enrollment.installments.every(inst => inst.status === 'paid');
          const paidCount = enrollment.installments.filter(inst => inst.status === 'paid').length;
          const totalInstallments = enrollment.installments.length;

          return (
            <Grid item key={enrollment.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F5F5F5' }}>
                <CardMedia
                  component="img"
                  height="130"
                  image={`data:image/jpeg;base64,${enrollment.course.photo}`}
                  alt={enrollment.course.name}
                />
                <CardContent>
                  <Box sx={{ height: '140px' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {enrollment.course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rs.{enrollment.course.price}
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 0, mt: 'auto' }}>
                    {allPaid ? (
                      <TaskAltIcon sx={{ color: 'green' }} />
                    ) : (
                      <Button variant="contained" onClick={() => handleOpenDrawer(enrollment)}>
                        {paidCount}/{totalInstallments}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{ width: '30%' }}
      >
        <Box sx={{ width: '30vw', padding: '20px' }}>
          {selectedEnrollment && (
            <>
              <Typography variant="h5">{selectedEnrollment.course.name}</Typography>
              <Typography variant="body2">Total Fee: ₹{selectedEnrollment.course.price}</Typography>
              <Box sx={{ marginTop: '20px' }}>
                {selectedEnrollment.installments.map((installment, index) => (
                  <Accordion 
                    sx={{marginBottom: '.5rem'}}
                    key={installment.id} 
                    expanded={installment === paymentState.selectedInstallment}
                    onChange={() => {}}
                  >
                    <AccordionSummary
                      expandIcon={installment === paymentState.selectedInstallment ? <ExpandMoreIcon /> : null}
                    >
                      <Box sx={{ display: 'flex' }}>
                        <Box>
                          <Typography>Installment {index + 1}</Typography>
                          {installment.status === 'paid' ? (
                          <Typography>Paid Amount: ₹{installment.amount_paid}</Typography>
                        ) : (
                          <Typography>Due Amount: ₹{installment.amount_due}</Typography>
                        )}
                        </Box>

                        {installment.status === 'paid' ? (
                          <TaskAltIcon sx={{ color: 'green', marginLeft: '1rem' }} />
                        ) : (
                          <PendingActionsIcon sx={{ color: '#D1D100', marginLeft: '1rem' }} />
                        )}
                      </Box>

                    </AccordionSummary>
                    <AccordionDetails>
                      {installment.status === 'paid' ? (
                        <Typography>Paid: ₹{installment.amount_paid}</Typography>
                      ) : installment === paymentState.selectedInstallment ? (
                        <>
                          <Typography>
                            Due: ₹{installment.amount_due} | Paid: ₹{installment.amount_paid}
                          </Typography>
                          <Box sx={{ marginTop: '10px' }}>
                            <TextField
                              type="number"
                              value={paymentState.amount}
                              onChange={(e) => handleAmountChange(e.target.value)}
                              sx={{ width: '100%' }}
                              error={paymentState.amountError}
                              helperText = {paymentState.amountError ? `Amount exceeds total due of ₹${paymentState.totalDueAmount}` : ''}
                            />
                          </Box>
                          {paymentState.amount < installment.amount_due && (
                            <RadioGroup
                              value={paymentState.selectedOption}
                              onChange={handleOptionChange}
                              sx={{ marginTop: '10px' }}
                            >
                              <FormControlLabel value="add_to_next" control={<Radio />} label="Add to next installment" />
                              <FormControlLabel value="new_installment" control={<Radio />} label="Create new installment" />
                            </RadioGroup>
                          )}
                          <Button
                            variant="contained"
                            sx={{ marginTop: '10px', width: '100%' }}
                            disabled={!paymentState.payNowEnabled}
                            onClick={handlePayNow}
                          >
                            Pay Now ₹{paymentState.amount}
                          </Button>
                        </>
                      ) : (
                        <Typography>Due: ₹{installment.amount_due}</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Container>
  );
}

export default EnrolledCourses;