import React from 'react';

import { Box, Typography } from '@mui/material';

import type { StatsTodayData } from '../../types/homepage.ts';

interface TodaysStatsWidgetProps {
  data?: StatsTodayData;
}

export const TodaysStatsWidget: React.FC<TodaysStatsWidgetProps> = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">Trips Completed</Typography>
        <Typography variant="body1" style={{ fontWeight: "bold" }}>{data?.trips ?? 0}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">CO₂ Saved Today</Typography>
        <Typography variant="body1" style={{ fontWeight: "bold" }} color="primary.main">
          {data?.co2Saved ?? 0} kg
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">Peak Usage Hours</Typography>
        <Typography variant="body1" style={{ fontWeight: "bold" }}>{data?.peakHour ?? '-'}</Typography>
      </Box>
    </Box>
  );
};