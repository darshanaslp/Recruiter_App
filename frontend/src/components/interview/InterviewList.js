import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import API from '../../services/api';
import { toast } from 'react-toastify';
import InterviewCard from './InterviewCard';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    try {
      const res = await API.get('/interviews');
      setInterviews(res.data);
    } catch (error) {
      toast.error('Failed to fetch interviews');
      console.error('Error fetching interviews:', error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Handler for joining a meeting – opens the meeting link in a new tab
  const handleJoin = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };

  // Handler to update interview status using a prompt for new status
  const handleStatusUpdate = async (interviewId) => {
    const newStatus = window.prompt(
      'Enter new status (Scheduled, In Progress, Completed, Cancelled):'
    );
    if (newStatus) {
      try {
        await API.put('/interviews/status', { interviewId, status: newStatus });
        toast.success('Interview status updated successfully');
        fetchInterviews(); // Refresh list
      } catch (error) {
        toast.error('Failed to update status');
        console.error('Error updating status:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Scheduled Interviews
      </Typography>
      {interviews.length > 0 ? (
        interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
            onJoin={handleJoin}
            onStatusUpdate={handleStatusUpdate}
          />
        ))
      ) : (
        <Typography>No interviews scheduled.</Typography>
      )}
    </Box>
  );
};

export default InterviewList;
