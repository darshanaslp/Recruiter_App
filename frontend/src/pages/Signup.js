import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Container, Typography, Box, MenuItem, Link } from '@mui/material';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too Short!').required('Required'),
  role: Yup.string().required('Required'),
});

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      await API.post('/auth/register', values);
      toast.success('Registration successful, please login');
      navigate('/login'); // Redirect to Login after signup
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    actions.setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        <Formik
          initialValues={{ name: '', email: '', password: '', role: 'candidate' }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                name="name"
                as={TextField}
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
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
              <Field
                name="role"
                as={TextField}
                select
                label="Role"
                variant="outlined"
                fullWidth
                margin="normal"
                error={touched.role && Boolean(errors.role)}
                helperText={touched.role && errors.role}
              >
                <MenuItem value="candidate">Candidate</MenuItem>
                <MenuItem value="recruiter">Recruiter</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Field>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Signup
              </Button>
            </Form>
          )}
        </Formik>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
