import React from 'react';
import { Box, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';

function EmptyState({ message = 'No items found' }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="300px"
      color="text.secondary"
    >
      <InventoryIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export default EmptyState;
