import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import API from '../../services/api';
import { toast } from 'react-toastify';

const InterviewCard = ({ interview, onJoin, onStatusUpdate }) => {
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        // Get candidate details by candidate id
        const res = await API.get(`/candidate/${interview.candidateId}`);
        setCandidate(res.data);
      } catch (error) {
        toast.error('Failed to fetch candidate details');
        console.error('Error fetching candidate details:', error);
      }
    };

    if (interview.candidateId) {
      fetchCandidate();
    }
  }, [interview.candidateId]);

  const handleUpdate = () => {
    // For now, simply log the interview data.
    // You can modify this to call onStatusUpdate with interview.id,
    // or open a modal to change the status.
    onStatusUpdate(interview.id);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">
          Interview for Job ID: {interview.jobId}
        </Typography>
        <Typography variant="body2">
          Date: {new Date(interview.date).toLocaleString()}
        </Typography>
        <Typography variant="body2">
          Status: {interview.status}
        </Typography>
        {candidate && candidate.user && (
          <>
            <Typography variant="body2">
              Candidate Name: {candidate.user.name}
            </Typography>
            <Typography variant="body2">
              Candidate Email: {candidate.user.email}
            </Typography>
          </>
        )}
        <Box sx={{ mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
            onClick={() => onJoin(interview.meetingLink)}
          >
            Join Interview
          </Button>
          <Button variant="contained" color="secondary" onClick={handleUpdate}>
            Update Status
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InterviewCard;
