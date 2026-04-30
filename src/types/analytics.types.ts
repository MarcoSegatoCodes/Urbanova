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
  [key: string]: any;
  day: string;
  trips: number;
}

export interface TripsByVehicleType {
  type: string;
  value: number;
}

export interface CO2ByMonth {
  [key: string]: any;
  month: string;
  co2: number;
}

export interface UsageByStation {
  [key: string]: any;
  station: string;
  usage: number;
}

export interface BatteryConsumptionOverTime {
  [key: string]: any;
  time: string;
  consumption: number;
}

export interface Analytics {
  summary: AnalyticsSummary;
  tripsByDayOfWeek: TripsByDay[];
  tripsByVehicleType: TripsByVehicleType[];
  co2SavedByMonth: CO2ByMonth[];
  usageByStation: UsageByStation[];
  batteryConsumptionOverTime: BatteryConsumptionOverTime[];
}
