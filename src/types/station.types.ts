export type StationType = "terminal" | "stop" | "hub" | "depot";

export type StationStatus = "operational" | "closed" | "under-construction";

export interface StationCoordinates {
  latitude: number;
  longitude: number;
}

export interface StationAmenities {
  parking: boolean;
  wheelchairAccess: boolean;
  restrooms: boolean;
  ticketCounter: boolean;
  wifi: boolean;
}

export interface Station {
  id: string;
  name: string;
  type: StationType;
  status: StationStatus;
  coordinates?: StationCoordinates;
  address?: string;
  capacity?: number;
  amenities?: StationAmenities;
  connectedStationIds?: string[];
  operatingHours?: {
    open: string;
    close: string;
  };
}
