import React from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const JobSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  requirements: Yup.string().required('Required'),
});

const JobPosting = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      await API.post('/jobs', values);
      toast.success('Job created successfully');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Job creation failed');
    }
    actions.setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Job Posting
        </Typography>
        <Formik
          initialValues={{ title: '', description: '', requirements: '' }}
          validationSchema={JobSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                name="title"
                as={TextField}
                label="Job Title"
                fullWidth
                margin="normal"
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
              <Field
                name="description"
                as={TextField}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
              <Field
                name="requirements"
                as={TextField}
                label="Requirements"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                error={touched.requirements && Boolean(errors.requirements)}
                helperText={touched.requirements && errors.requirements}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Post Job
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default JobPosting;
