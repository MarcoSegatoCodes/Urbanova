export interface AnalyticsSummary {
  totalVehicles: number;
  activeVehicles: number;
  totalStations: number;
  operationalStations: number;
  totalTripsToday: number;
  totalTripsThisMonth: number;
  co2SavedToday: number;
  co2SavedThisMonth: number;
  co2SavedAllTime: number;
}

export interface TripsByDay {
  day: string;
  trips: number;
}

export interface TripsByVehicleType {
  type: string;
  value: number;
}

export interface CO2ByMonth {
  month: string;
  co2: number;
}

export interface Analytics {
  summary: AnalyticsSummary;
  tripsByDayOfWeek: TripsByDay[];
  tripsByVehicleType: TripsByVehicleType[];
  co2SavedByMonth: CO2ByMonth[];
}

export type TimePeriod = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | string;

export type MetricType =
  | "RIDERSHIP"
  | "REVENUE"
  | "PERFORMANCE"
  | "SUSTAINABILITY"
  | string;

export interface MetricDataPoint {
  label: string;
  value: number;
}

export interface DashboardMetric {
  id: string;
  name: string;
  type: MetricType;
  period: TimePeriod;
  currentValue: number;
  trend: "up" | "down" | "flat";
  data: MetricDataPoint[];
}

export interface RidershipStats {
  totalTrips: number;
  activeUsers: number;
}

export interface RevenueStats {
  totalRevenue: number;
  averageTicketValue: number;
}

export interface PerformanceStats {
  onTimeRate: number;
  averageDelayMinutes: number;
  vehicleUtilization: number;
}

export interface AnalyticsReport {
  id: string;
  period: TimePeriod;
  startDate: string;
  endDate: string;
  generatedAt: string;
  ridership: RidershipStats;
  revenue: RevenueStats;
  performance: PerformanceStats;
}
