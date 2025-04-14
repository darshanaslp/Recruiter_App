import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too Short!').required('Required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      const res = await API.post('/auth/login', values);
      // Store token and email (and role if needed) on login
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken); 
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('id', res.data.user.id);
      toast.success('Logged in successfully');
      navigate('/'); // Navigate to Dashboard
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
    actions.setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                name="email"
                as={TextField}
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <Field
                name="password"
                as={TextField}
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <Typography variant="body2" sx={{ mt: 2 }}>
          New user?{' '}
          <Link href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
            Signup here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
