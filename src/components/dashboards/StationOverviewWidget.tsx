import React from 'react';

import { Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

import type { StationData } from '../../types/homepage.ts';

interface StationOverviewWidgetProps {
  data?: StationData;
}

export const StationOverviewWidget: React.FC<StationOverviewWidgetProps> = ({ data }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h3">{data?.total ?? 0}</Typography>
        <Typography variant="body2" color="text.secondary">Total Stations</Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <List disablePadding>
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 35 }}><CheckCircleIcon color="success" /></ListItemIcon>
          <ListItemText primary="Operational" />
          <Typography style={{ fontWeight: "bold" }}>{data?.operational ?? 0}</Typography>
        </ListItem>
        <ListItem disablePadding sx={{ py: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 35 }}><WarningIcon color="warning" /></ListItemIcon>
          <ListItemText primary="Under Maintenance" />
          <Typography style={{ fontWeight: "bold" }}>{data?.maintenance ?? 0}</Typography>
        </ListItem>
      </List>
    </Box>
  );
};