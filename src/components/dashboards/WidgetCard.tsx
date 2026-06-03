import React from 'react';

import { Card, CardContent, Typography, Skeleton } from '@mui/material';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
  loading: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, loading }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 1 }} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};