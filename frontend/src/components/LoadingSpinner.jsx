import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
      <CircularProgress size={50} thickness={4} color="primary" />
    </Box>
  );
}

export default LoadingSpinner;
