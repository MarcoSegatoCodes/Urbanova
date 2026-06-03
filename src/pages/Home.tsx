import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip, Grid } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

import type { DashboardData } from "../types/homepage.ts";
import { WidgetCard } from "../components/dashboards/WidgetCard.tsx";
import { FleetSummaryWidget } from "../components/dashboards/FleetSummaryWidget.tsx";
import { LiveAlertsWidget } from "../components/dashboards/LiveAlertsWidget.tsx";
import { QuickActionsWidget } from "../components/dashboards/QuickActionsWidget.tsx";
import { StationOverviewWidget } from "../components/dashboards/StationOverviewWidget.tsx";
import { TodaysStatsWidget } from "../components/dashboards/TodaysStatsWidget.tsx";
import vehiclesData from "../data/vehicles.json";
import stationsData from "../data/stations.json";
import analyticsData from "../data/analytics.json";

// Calculate real metrics from actual data
const fetchUrbanovaData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Fleet metrics
      const total = vehiclesData.length;
      const active = vehiclesData.filter(
        (v: unknown) => (v as Record<string, unknown>).status !== "MAINTENANCE",
      ).length;
      const inactive = total - active;
      const bikes = vehiclesData.filter(
        (v: unknown) => (v as Record<string, unknown>).type === "BIKE",
      ).length;
      const eVehicles = vehiclesData.filter(
        (v: unknown) =>
          (v as Record<string, unknown>).type === "ELECTRIC_CAR" ||
          (v as Record<string, unknown>).type === "ELECTRIC_SCOOTER",
      ).length;

      // Station metrics
      const totalStations = stationsData.length;
      const operational = stationsData.filter(
        (s: unknown) => (s as Record<string, unknown>).status === "OPERATIONAL",
      ).length;
      const maintenance = totalStations - operational;

      // Get today's stats from analytics
      const todaysStats = ((analyticsData as Record<string, unknown>)
        .todaysStats || {
        tripsCompleted: 0,
        co2SavedToday: 0,
        peakUsageHours: "N/A",
      }) as Record<string, unknown>;

      // Generate alerts based on data
      const alerts = [];

      // Alert for low battery vehicles
      const lowBatteryVehicles = vehiclesData.filter((v: unknown) => {
        const vehicle = v as Record<string, unknown>;
        return (vehicle.batteryLevel as number) < 25;
      });
      if (lowBatteryVehicles.length > 0) {
        alerts.push({
          id: 1,
          message: `${lowBatteryVehicles.length} vehicle(s) with low battery (<25%)`,
          severity: "warning" as const,
        });
      }

      // Alert for maintenance needed
      const maintenanceVehicles = vehiclesData.filter(
        (v: unknown) => (v as Record<string, unknown>).status === "MAINTENANCE",
      );
      if (maintenanceVehicles.length > 0) {
        alerts.push({
          id: 2,
          message: `${maintenanceVehicles.length} vehicle(s) in maintenance`,
          severity: "critical" as const,
        });
      }

      // Alert for stations in maintenance
      const stationsInMaintenance = stationsData.filter(
        (s: unknown) => (s as Record<string, unknown>).status !== "OPERATIONAL",
      );
      if (stationsInMaintenance.length > 0) {
        alerts.push({
          id: 3,
          message: `${stationsInMaintenance.length} station(s) down for maintenance`,
          severity: "warning" as const,
        });
      }

      // If no alerts, add an info message
      if (alerts.length === 0) {
        alerts.push({
          id: 4,
          message: "All systems operational",
          severity: "info" as const,
        });
      }

      resolve({
        fleet: { total, active, inactive, bikes, eVehicles },
        stations: { total: totalStations, operational, maintenance },
        alerts,
        statsToday: {
          trips: (todaysStats.tripsCompleted as number) || 0,
          co2Saved: (todaysStats.co2SavedToday as number) || 0,
          peakHour: (todaysStats.peakUsageHours as string) || "N/A",
        },
      });
    }, 500);
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
      console.error("Error fetching Urbanova dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initData = async () => {
      if (mounted) {
        setLoading(true);
        try {
          const result = await fetchUrbanovaData();
          if (mounted) {
            setData(result);
            setLastUpdated(new Date());
          }
        } catch (error) {
          console.error("Error fetching Urbanova dashboard:", error);
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      }
    };

    initData();

    const interval = setInterval(handleRefresh, 60000); // Auto-refresh every 60 seconds
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Dynamic header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Welcome to Urbanova
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time snapshot of your mobility ecosystem. Last updated:{" "}
            <strong>{lastUpdated.toLocaleTimeString()}</strong>
          </Typography>
        </Box>

        <Tooltip title="Refresh Dashboard">
          <IconButton
            onClick={handleRefresh}
            color="primary"
            sx={{ bgcolor: "background.paper", boxShadow: 2 }}
          >
            <RefreshIcon
              sx={{
                animation: loading ? "spin 1s linear infinite" : "none",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
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
