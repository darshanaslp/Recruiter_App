import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const InterviewSchema = Yup.object().shape({
  candidateId: Yup.number().required('Required'),
  jobId: Yup.number().required('Required'),
  date: Yup.date().required('Required'),
});

const InterviewSchedule = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);

  // Load candidate dropdown list (for recruiters)
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get('/candidate'); // New endpoint for recruiters
        setCandidates(res.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, []);

  // Load jobs (for recruiters: jobs they posted; for candidate: all jobs)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleSubmit = async (values, actions) => {
    try {
      await API.post('/interviews/schedule', values);
      toast.success('Interview scheduled');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    }
    actions.setSubmitting(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Schedule Interview
        </Typography>
        <Formik
          initialValues={{ candidateId: '', jobId: '', date: '' }}
          validationSchema={InterviewSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              {/* Candidate Dropdown */}
              <Field
                name="candidateId"
                as={TextField}
                select
                label="Select Candidate"
                fullWidth
                margin="normal"
                error={touched.candidateId && Boolean(errors.candidateId)}
                helperText={touched.candidateId && errors.candidateId}
              >
                {candidates.map((cand) => (
                  <MenuItem key={cand.id} value={cand.id}>
                    {cand.user.name} ({cand.user.email})
                  </MenuItem>
                ))}
              </Field>

              {/* Job Dropdown */}
              <Field
                name="jobId"
                as={TextField}
                select
                label="Select Job"
                fullWidth
                margin="normal"
                error={touched.jobId && Boolean(errors.jobId)}
                helperText={touched.jobId && errors.jobId}
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Field>

              {/* Interview Date */}
              <Field
                name="date"
                as={TextField}
                label="Interview Date"
                type="datetime-local"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={touched.date && Boolean(errors.date)}
                helperText={touched.date && errors.date}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 2 }}
              >
                Schedule Interview
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default InterviewSchedule;
