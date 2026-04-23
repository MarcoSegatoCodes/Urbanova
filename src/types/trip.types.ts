export type TripStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "delayed"
  | "cancelled";

export interface TripStop {
  stationId: string;
  arrivalTime: string;
  departureTime: string;
  platform?: string;
  stopOrder: number;
}

export interface TripDelay {
  minutes: number;
  reason?: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  routeId: string;
  vehicleId: string;
  driverId?: string;
  status: TripStatus;
  originStationId: string;
  destinationStationId: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  stops: TripStop[];
  delay?: TripDelay;
  passengerCount?: number;
  maxCapacity: number;
  fare: number;
  currency: string;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  stationIds: string[];
  vehicleType: string;
  averageDuration: number;
  distance: number;
  isActive: boolean;
}
