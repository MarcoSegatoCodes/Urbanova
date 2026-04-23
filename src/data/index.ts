export type VehicleType = 'BIKE' | 'SCOOTER' | 'ELECTRIC_CAR' | 'ELECTRIC_BUS';
export type Status = 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE' | 'OUT_OF_SERVICE';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  status: Status;
  batteryLevel: number;
  currentStationId: string;
  coordinates: { lat: number; lng: number };
}

export interface Station {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  availableBikes: number;
  totalDocks: number;
}