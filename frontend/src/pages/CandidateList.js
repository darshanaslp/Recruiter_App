import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Box } from '@mui/material';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Assume backend endpoint returns list of candidates for recruiters
        const res = await API.get('/candidate');
        setCandidates(res.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };
    fetchCandidates();
  }, []);

  const handleViewInterview = (candidateId) => {
    // Navigate to a page that shows candidate interview details.
    navigate(`/candidates/${candidateId}/interviews`);
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Candidate Applications
        </Typography>
        <List>
          {candidates.map((candidate) => (
            <ListItem key={candidate.id} divider>
              <ListItemText primary={candidate.user.name} secondary={candidate.user.email} />
              <ListItemSecondaryAction>
                <Button variant="contained" onClick={() => handleViewInterview(candidate.user.id)}>
                  Interview Details
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default CandidateList;
