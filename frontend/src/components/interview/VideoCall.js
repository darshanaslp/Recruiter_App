import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const VideoCall = ({ meetingLink }) => {
  return (
    <Container>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5">Video Call</Typography>
        {/* You could embed the Jitsi meeting using an iframe */}
        <iframe
          src={meetingLink}
          style={{ width: '100%', height: '600px', border: 0 }}
          allow="camera; microphone; fullscreen"
          title="Video Call"
        />
      </Box>
    </Container>
  );
};

export default VideoCall;
