export interface FleetData {
  total: number;
  active: number;
  inactive: number;
  bikes: number;
  eVehicles: number;
}

export interface StationData {
  total: number;
  operational: number;
  maintenance: number;
}

export interface AlertItem {
  id: number;
  message: string;
  severity: 'warning' | 'critical' | 'info';
}

export interface StatsTodayData {
  trips: number;
  co2Saved: number;
  peakHour: string;
}

export interface DashboardData {
  fleet: FleetData;
  stations: StationData;
  alerts: AlertItem[];
  statsToday: StatsTodayData;
}