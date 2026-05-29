import React from 'react';

import { Box, Typography, Divider, Chip } from '@mui/material';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import ElectricScooterIcon from '@mui/icons-material/ElectricScooter';

import type { FleetData } from '../../types/homepage';

interface FleetSummaryWidgetProps {
  data?: FleetData;
}

export const FleetSummaryWidget: React.FC<FleetSummaryWidgetProps> = ({ data }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h3">{data?.total ?? 0}</Typography>
        <Typography variant="body2" color="text.secondary">Total Vehicles</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
        <Typography variant="body2">Active/Inactive:</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label={`${data?.active ?? 0} Active`} size="small" color="success" />
          <Chip label={`${data?.inactive ?? 0} Inactive`} size="small" color="error" variant="outlined" />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2">Type Breakdown:</Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PedalBikeIcon fontSize="small" /> {data?.bikes ?? 0} &nbsp;|&nbsp; <ElectricScooterIcon fontSize="small" /> {data?.eVehicles ?? 0}
        </Typography>
      </Box>
    </Box>
  );
};