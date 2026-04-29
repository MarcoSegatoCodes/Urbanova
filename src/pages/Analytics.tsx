import { useState } from "react";
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";

import type { Analytics as AnalyticsType } from "../types/analytics.types";
import analyticsDataJson from "../data/analytics.json";

import { ChartCard } from "../components/Analytics/ChartCard";

const data = analyticsDataJson as AnalyticsType;

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("30");

  return (
    <Box sx={{ p: 3 }}>
      {/* Header and Date Filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
            Analytics & Sustainability
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View your environmental impact and usage trends here.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={timeRange}
            label="Date Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chart grid */}
      <Grid container spacing={3}>
        
        {/* Pie Chart - Vehicle type distribution */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Vehicle Fleet Distribution" exportData={data.tripsByVehicleType}>
            <PieChart
              series={[{
                data: data.tripsByVehicleType.map((v, i) => ({
                  id: i,
                  value: v.value,
                  label: v.type,
                })),
                innerRadius: 20,
                paddingAngle: 2,
              }]}
              slotProps={{ legend: { direction: 'horizontal' as const, position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </ChartCard>
        </Grid>

        {/* Pie Chart - Trip by vehicle type */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Trips by Vehicle Type" exportData={data.tripsByVehicleType}>
            <PieChart
              series={[{
                data: data.tripsByVehicleType.map((v, i) => ({
                  id: i,
                  value: v.value,
                  label: v.type,
                })),
                innerRadius: 20,
                paddingAngle: 2,
              }]}
              slotProps={{ legend: { direction: 'horizontal' as const, position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </ChartCard>
        </Grid>

        {/* Bars Chart - Usage by station */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Usage by Station" exportData={data.usageByStation}>
            <BarChart
              dataset={data.usageByStation}
              xAxis={[{ scaleType: 'band', dataKey: 'station' }]}
              series={[{ dataKey: 'usage', label: 'Trips Started' }]}
            />
          </ChartCard>
        </Grid>

        {/* Bars Chart - Trips per day of week */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Trips per Day of Week" exportData={data.tripsByDayOfWeek}>
            <BarChart
              dataset={data.tripsByDayOfWeek}
              xAxis={[{ scaleType: 'band', dataKey: 'day' }]}
              series={[{ dataKey: 'trips', label: 'Trips' }]}
            />
          </ChartCard>
        </Grid>

        {/* Line Chart - CO2 saving over time */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="CO2 Saved Over Time (kg)" exportData={data.co2SavedByMonth}>
            <LineChart
              dataset={data.co2SavedByMonth}
              xAxis={[{ scaleType: 'point', dataKey: 'month' }]}
              series={[{ dataKey: 'co2', label: 'CO2 Saved', area: true }]}
            />
          </ChartCard>
        </Grid>

        {/* Line Chart - Average battery consumption */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ChartCard title="Average Battery Consumption (%)" exportData={data.batteryConsumptionOverTime}>
            <LineChart
              dataset={data.batteryConsumptionOverTime}
              xAxis={[{ scaleType: 'point', dataKey: 'time' }]}
              series={[{ dataKey: 'consumption', label: 'Battery Used (%)' }]}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}