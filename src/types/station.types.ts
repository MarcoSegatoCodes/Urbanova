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

export interface StationCoordinates {
  lat: number;
  lng: number;
}

export interface StationAmenities {
  [key: string]: boolean | undefined;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  coordinates: StationCoordinates;
  type: StationType;
  status: StationStatus;
  totalDocks: number;
  availableDocks: number;
  availableBikes: number;
  availableEVehicles: number;
  chargingPorts: number;
  lastInspection: string;
  connectedStationIds?: string[];
  amenities?: StationAmenities;
}
