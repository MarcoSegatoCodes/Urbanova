import type { Coordinates } from "./common.types";

export type StationType =
  | "HYBRID"
  | "BIKE_ONLY"
  | "EV_ONLY"
  | "PARKING"
  | string;

export type StationStatus =
  | "OPERATIONAL"
  | "MAINTENANCE"
  | "OFFLINE"
  | "COMING_SOON"
  | string;

export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: StationType;
  status: StationStatus;
  totalDocks: number;
  availableDocks: number;
  availableBikes: number;
  availableEVehicles: number;
  chargingPorts: number;
  lastInspection: string;
  connectedStationIds?: string[];
  amenities?: Record<string, boolean>;
}
