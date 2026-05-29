import React from 'react';

import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MapIcon from '@mui/icons-material/Map';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

export const QuickActionsWidget: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} fullWidth>
        Add New Vehicle
      </Button>
      <Button variant="outlined" color="secondary" startIcon={<MapIcon />} fullWidth>
        View Full Map
      </Button>
      <Button variant="outlined" color="error" startIcon={<ReportProblemIcon />} fullWidth>
        Report Issue
      </Button>
    </Box>
  );
};