import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  TextField,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import API from '../services/api';
import { toast } from 'react-toastify';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CountUp from "react-countup";

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

// ---------------- Admin Dashboard ----------------
const AdminDashboard = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'recruiter' });

  const fetchRecruiters = async () => {
    try {
      // Example endpoint that returns recruiters from the User table where role === 'recruiter'
      const res = await API.get('/users/recruiters');
      setRecruiters(res.data);
    } catch (error) {
      toast.error('Failed to fetch recruiters');
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const handleModalOpen = (recruiter = null) => {
    setEditingRecruiter(recruiter);
    if (recruiter) {
      setFormData({ name: recruiter.name, email: recruiter.email, password: '' });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'recruiter' });
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingRecruiter(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingRecruiter) {
        // Update recruiter via a PUT request (assuming an endpoint exists)
        await API.put(`/users/${editingRecruiter.id}`, formData);
        toast.success('Recruiter updated successfully');
      } else {
        // Create recruiter via the /auth/register route
        await API.post('/auth/register', formData);
        toast.success('Recruiter created successfully');
      }
      fetchRecruiters();
      handleModalClose();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete recruiter via a DELETE request (assuming an endpoint exists)
      await API.delete(`/users/${id}`);
      toast.success('Recruiter deleted successfully');
      fetchRecruiters();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={() => handleModalOpen()}>
          Create Recruiter
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recruiters.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell>{rec.name}</TableCell>
              <TableCell>{rec.email}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleModalOpen(rec)}>
                  <Visibility />
                </IconButton>
                <IconButton onClick={() => handleModalOpen(rec)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(rec.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            {editingRecruiter ? 'Edit Recruiter' : 'Create Recruiter'}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 2 }}>
            {editingRecruiter ? 'Update' : 'Create'}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};



// ---------------- Recruiter Dashboard ----------------
const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    jobPosts: 0,
    candidateCount: 0,
    inProgress: 0,
    completed: 0,
    scheduled: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Fetch Jobs Count
      const jobRes = await API.get("/jobs");
      const jobPosts = jobRes.data.length;

      // Fetch Interviews
      const interviewRes = await API.get("/interviews");
      const interviews = interviewRes.data;

      // Calculate Interview Stats
      const candidateSet = new Set();
      let inProgress = 0;
      let completed = 0;
      let scheduled = 0;

      interviews.forEach((interview) => {
        candidateSet.add(interview.candidateId);
        if (interview.status === "In Progress") inProgress++;
        if (interview.status === "Completed") completed++;
        if (interview.status === "Scheduled") scheduled++;
      });

      setStats({
        jobPosts,
        candidateCount: candidateSet.size,
        inProgress,
        completed,
        scheduled,
      });

      setLoading(false); // Stop loading animation
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Recruiter Dashboard
      </Typography>
      <Grid container spacing={2}>
        {[
          { label: "Job Posts", value: stats.jobPosts },
          { label: "Candidates", value: stats.candidateCount },
          { label: "In Progress", value: stats.inProgress },
          { label: "Completed", value: stats.completed },
          { label: "Scheduled", value: stats.scheduled },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                {loading ? (
                  <Skeleton width={50} height={30} />
                ) : (
                  <Typography variant="h5">
                    <CountUp end={item.value} duration={1} />
                  </Typography>
                )}
                <Typography>{item.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// ---------------- Candidate Dashboard ----------------
const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/interviews');
      setApplications(res.data); // Save the full response to the state
    } catch (error) {
      toast.error('Failed to fetch interview');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Candidate Dashboard
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.job.title}</TableCell> {/* Use app.job.title to get the job title */}
              <TableCell>{app.status}</TableCell> {/* Display interview status */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// ---------------- Main Dashboard Component ----------------
const Dashboard = () => {
  const role = localStorage.getItem('role') || 'User';

  return (
    <>
      <Container sx={{ mt: 4 }}>
        {role === 'admin' && <AdminDashboard />}
        {role === 'recruiter' && <RecruiterDashboard />}
        {role === 'candidate' && <CandidateDashboard />}
      </Container>
    </>
  );
};

export default Dashboard;
