import vehiclesData from './vehicles.json';
import stationsData from './stations.json';

export type VehicleType = 'BIKE' | 'SCOOTER' | 'ELECTRIC_CAR' | 'ELECTRIC_BUS' | 'CAR';
export type Status = 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE' | 'OUT_OF_SERVICE' | 'OPERATIONAL';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: Status;
  batteryLevel: number;
  currentStationId: string | null;
  coordinates: { lat: number; lng: number };
  lastMaintenanceDate?: string;
  nextMaintenanceDue?: string;
  totalTrips?: number;
  totalKmTraveled?: number;
  dateAdded?: string;
  notes?: string;
}

export interface Station {
  id: string;
  name: string;
  address?: string;
  coordinates: { lat: number; lng: number };
  type: 'HYBRID' | 'BIKE_ONLY';
  status: 'OPERATIONAL' | 'MAINTENANCE';
  totalDocks: number;
  availableDocks: number;
  availableBikes: number;
  availableEVehicles: number;
  chargingPorts: number;
  lastInspection?: string;
}

export const mockData = {
  vehicles: vehiclesData as Vehicle[],
  stations: stationsData as Station[]
};