import type { Vehicle, VehicleType, VehicleStatus } from "../types";

const STORAGE_KEY = "vehicles";

let vehicles: Vehicle[] = [];

// --- INIT ---
export const initVehicles = (data: Vehicle[]): void => {
  vehicles = [...data];
};

// --- READ Operations ---
export const getAllVehicles = (): Vehicle[] => [...vehicles];

export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find((v) => v.id === id);
};

export const getVehiclesByType = (type: VehicleType): Vehicle[] => {
  return vehicles.filter((v) => v.type === type);
};

export const getVehiclesByStatus = (status: VehicleStatus): Vehicle[] => {
  return vehicles.filter((v) => v.status === status);
};

export const getVehiclesByStation = (stationId: string): Vehicle[] => {
  return vehicles.filter((v) => v.currentStationId === stationId);
};

export const getAvailableVehicles = (): Vehicle[] => {
  return vehicles.filter((v) => v.status === "AVAILABLE");
};

// --- WRITE Operations ---
export const addVehicle = (vehicle: Vehicle): Vehicle => {
  vehicles = [...vehicles, vehicle];
  return vehicle;
};

export const updateVehicle = (
  id: string,
  updates: Partial<Vehicle>,
): Vehicle | undefined => {
  const index = vehicles.findIndex((v) => v.id === id);
  if (index === -1) return undefined;
  vehicles[index] = { ...vehicles[index], ...updates };
  return vehicles[index];
};

export const updateVehicleStatus = (
  id: string,
  status: VehicleStatus,
): Vehicle | undefined => {
  return updateVehicle(id, { status });
};

export const assignVehicleToStation = (
  vehicleId: string,
  stationId: string,
): Vehicle | undefined => {
  return updateVehicle(vehicleId, { currentStationId: stationId });
};

export const deleteVehicle = (id: string): boolean => {
  const initialLength = vehicles.length;
  vehicles = vehicles.filter((v) => v.id !== id);
  return vehicles.length < initialLength;
};

// --- UTILITY Operations ---
export const getVehicleCount = (): number => vehicles.length;

export const getVehicleCountByStatus = (): Record<VehicleStatus, number> => {
  return vehicles.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    },
    {} as Record<VehicleStatus, number>,
  );
};

export const searchVehicles = (query: string): Vehicle[] => {
  const lowerQuery = query.toLowerCase();
  return vehicles.filter(
    (v) =>
      v.id.toLowerCase().includes(lowerQuery) ||
      v.name.toLowerCase().includes(lowerQuery) ||
      v.type.toLowerCase().includes(lowerQuery) ||
      v.model?.toLowerCase().includes(lowerQuery),
  );
};

// --- STORAGE KEY Export ---
export const VEHICLE_STORAGE_KEY = STORAGE_KEY;
