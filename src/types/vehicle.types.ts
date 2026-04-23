export type VehicleType = "bus" | "train" | "tram" | "ferry" | "subway";

export type VehicleStatus =
  | "available"
  | "in-transit"
  | "maintenance"
  | "out-of-service";

export interface Vehicle {
  id: string;
  type: VehicleType;
  model?: string;
  capacity: number;
  currentStationId?: string;
  status: VehicleStatus;
  lastMaintenanceDate?: string;
  mileage?: number;
  assignedRouteId?: string;
}
