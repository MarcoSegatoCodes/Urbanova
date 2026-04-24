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
}
