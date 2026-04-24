import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  hasData?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, hasData }) => {
  const handleExport = () => {
    // Nice to have: Export logic (PNG/CSV)
    console.log(`Exporting ${title}...`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography  variant= "h6" color= "text.secondary" sx={{ fontWeight: "bold" }} >
            {title}
          </Typography>
          <Tooltip title="Export as PNG/CSV">
            <IconButton onClick={handleExport} size="small" color="primary">
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Empty State Management */}
        {!hasData ? (
          <Box sx={{ display:"flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <Typography variant="body1" color="text.disabled">
              No data for selected period
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};