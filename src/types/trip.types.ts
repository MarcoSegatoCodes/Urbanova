export type TripStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED"
  | string;

export interface TripDelay {
  minutes: number;
  reason: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  userId: string;
  startStationId: string;
  endStationId: string;
  startTime: string;
  endTime: string;
  distanceKm: number;
  co2SavedKg: number;
  status?: TripStatus;
  routeId?: string;
  driverId?: string;
  scheduledDeparture?: string;
  actualDeparture?: string;
  actualArrival?: string;
  delay?: TripDelay;
  passengerCount?: number;
}

export interface Route {
  id: string;
  name: string;
  vehicleType: string;
  isActive: boolean;
  stopIds?: string[];
}
