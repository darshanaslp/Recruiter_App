import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationDetails, setApplicationDetails] = useState('');
  const role = localStorage.getItem('role');
  const userEmail = localStorage.getItem('email'); // You might use user ID instead
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // For recruiters, fetch only jobs they posted. For candidates, fetch all jobs.
        let endpoint = '/jobs';
        if (role === 'recruiter') {
          // Assume backend supports a query param or separate endpoint for recruiter jobs.
          endpoint = `/jobs?recruiterEmail=${userEmail}`;
        }
        const res = await API.get(endpoint);
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [role, userEmail]);

  const handleApply = (jobId) => {
    setSelectedJob(jobId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedJob(null);
    setApplicationDetails('');
  };

  const handleSubmitApplication = async () => {
    if (!applicationDetails) {
      toast.error('Please provide your application details.');
      return;
    }

    try {
      const values = { jobId: selectedJob, details: applicationDetails };
      await API.post('/jobs/apply', values); // Sending the application to the backend
      toast.success('Application submitted successfully');
      setOpenDialog(false);
      setSelectedJob(null);
      setApplicationDetails('');
    } catch (error) {
      toast.error('Error submitting application');
    }
  };

  const handleNewJob = () => {
    // For recruiter: navigate to JobPosting page
    navigate('/job-posting');
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Job Listings
        </Typography>
        {role === 'recruiter' && (
          <Button variant="contained" color="primary" onClick={handleNewJob} sx={{ mb: 2 }}>
            Create New Job Post
          </Button>
        )}
        <List>
          {jobs.map((job) => (
            <ListItem key={job.id} divider>
              <ListItemText primary={job.title} secondary={job.description} />
              {role === 'candidate' && (
                <ListItemSecondaryAction>
                  <Button variant="contained" onClick={() => handleApply(job.id)}>
                    Apply
                  </Button>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Apply Job Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          <TextField
            label="Application Details"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={applicationDetails}
            onChange={(e) => setApplicationDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitApplication} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobList;
