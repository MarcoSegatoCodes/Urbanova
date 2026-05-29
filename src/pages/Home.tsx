import { useState, useEffect } from 'react';

import { Box, Typography, IconButton, Tooltip, Grid } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import type { DashboardData } from '../types/homepage.ts';
import { WidgetCard } from '../components/dashboards/WidgetCard.tsx';
import { FleetSummaryWidget } from '../components/dashboards/FleetSummaryWidget.tsx';
import { LiveAlertsWidget } from '../components/dashboards/LiveAlertsWidget.tsx';
import { QuickActionsWidget } from '../components/dashboards/QuickActionsWidget.tsx';
import { StationOverviewWidget } from '../components/dashboards/StationOverviewWidget.tsx';
import { TodaysStatsWidget } from '../components/dashboards/TodaysStatsWidget.tsx';

// Mock API to simulate Urbanova in real time
const fetchUrbanovaData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        fleet: { total: 150, active: 124, inactive: 26, bikes: 90, eVehicles: 60 },
        stations: { total: 24, operational: 21, maintenance: 3 },
        alerts: [
          { id: 1, message: "Station 'Central' battery low (15%)", severity: 'warning' },
          { id: 2, message: 'Vehicle #404 offline for 2 hours', severity: 'critical' },
          { id: 3, message: "Scheduled maintenance for 'Park' station tomorrow", severity: 'info' },
        ],
        statsToday: { trips: 842, co2Saved: 124.5, peakHour: '08:00 - 09:00' },
      });
    }, 1200);
  });
};

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await fetchUrbanovaData();
      setData(result);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching Urbanova dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRefresh();
    const interval = setInterval(handleRefresh, 60000); // Auto-refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Dynamic header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Welcome to Urbanova
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time snapshot of your mobility ecosystem. 
            Last updated: <strong>{lastUpdated.toLocaleTimeString()}</strong>
          </Typography>
        </Box>

        <Tooltip title="Refresh Dashboard">
          <IconButton onClick={handleRefresh} color="primary" sx={{ bgcolor: 'background.paper', boxShadow: 2 }}>
            <RefreshIcon
              sx={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Grid Layout for Widgets */}
      <Grid container spacing={3}>
        
        {/* Fleet and Station Status */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WidgetCard title="Fleet Status" loading={loading}>
            <FleetSummaryWidget data={data?.fleet} />
          </WidgetCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <WidgetCard title="Stations Network" loading={loading}>
            <StationOverviewWidget data={data?.stations} />
          </WidgetCard>
        </Grid>

        {/* Alert Column */}
        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
          <WidgetCard title="System Alerts" loading={loading}>
            <LiveAlertsWidget data={data?.alerts} />
          </WidgetCard>
        </Grid>

        {/* Daily Statistics */}
        <Grid size={{ xs: 12, md: 8 }}>
          <WidgetCard title="Today's Performance" loading={loading}>
            <TodaysStatsWidget data={data?.statsToday} />
          </WidgetCard>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <WidgetCard title="Control Panel" loading={false}>
            <QuickActionsWidget />
          </WidgetCard>
        </Grid>

      </Grid>
    </Box>
  );
}