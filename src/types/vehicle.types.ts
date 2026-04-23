export type VehicleType = "BIKE" | "SCOOTER" | "CAR" | "BUS" | string;

export type VehicleStatus =
  | "AVAILABLE"
  | "IN_USE"
  | "MAINTENANCE"
  | "CHARGING"
  | "OUT_OF_SERVICE"
  | string;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: VehicleStatus;
  batteryLevel: number;
  currentStationId: string;
  lastMaintenanceDate: string;
  nextMaintenanceDue: string;
  totalTrips: number;
  totalKmTraveled: number;
  dateAdded: string;
  coordinates: Coordinates;
  notes: string;
}
