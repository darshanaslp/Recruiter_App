import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ textAlign: 'center', p: 2, mt: 4, backgroundColor: '#f1f1f1' }}>
      <Typography variant="body2">
        © 2025 Recruiter App. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
