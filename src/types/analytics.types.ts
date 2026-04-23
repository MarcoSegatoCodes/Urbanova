export type TimePeriod = "day" | "week" | "month" | "quarter" | "year";

export type MetricType =
  | "ridership"
  | "revenue"
  | "on-time-performance"
  | "occupancy"
  | "incidents";

export interface MetricDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface DashboardMetric {
  id: string;
  name: string;
  type: MetricType;
  currentValue: number;
  previousValue: number;
  changePercent: number;
  trend: "up" | "down" | "stable";
  period: TimePeriod;
  data: MetricDataPoint[];
}

export interface RidershipStats {
  totalRiders: number;
  averageDaily: number;
  peakHour: string;
  peakDayOfWeek: string;
  byVehicleType: Record<string, number>;
  byStation: Record<string, number>;
}

export interface RevenueStats {
  totalRevenue: number;
  currency: string;
  byTicketType: Record<string, number>;
  byPaymentMethod: Record<string, number>;
  averageTicketPrice: number;
}

export interface PerformanceStats {
  onTimePercentage: number;
  averageDelay: number;
  cancelledTrips: number;
  completedTrips: number;
  incidentCount: number;
}

export interface AnalyticsReport {
  id: string;
  generatedAt: string;
  period: TimePeriod;
  startDate: string;
  endDate: string;
  ridership: RidershipStats;
  revenue: RevenueStats;
  performance: PerformanceStats;
}
