import type { Vehicle, VehicleType, VehicleStatus } from "../types";

const STORAGE_KEY = "vehicles";

let vehicles: Vehicle[] = [];

// --- INIT ---
export const initVehicles = (data: Vehicle[]): void => {
  vehicles = [...data];
};

// --- READ Operations ---
export const getAllVehicles = (): Vehicle[] => [...vehicles];

export const getVehicles = (): Vehicle[] => getAllVehicles();

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
      v.type.toLowerCase().includes(lowerQuery) ||
      v.name.toLowerCase().includes(lowerQuery),
  );
};

// --- SIMULATION ---
const MOVE_DELTA = 0.008; // ~80m per tick

export const simulateVehicleMovement = (): void => {
  vehicles = vehicles.map((v) => {
    // Only IN_USE vehicles should move
    if (v.status !== "IN_USE") return v;

    return {
      ...v,
      coordinates: {
        lat: v.coordinates.lat + (Math.random() - 0.5) * MOVE_DELTA,
        lng: v.coordinates.lng + (Math.random() - 0.5) * MOVE_DELTA,
      },
    };
  });
};

/**
 * Simulate dynamic status changes:
 * - AVAILABLE vehicles have a chance to be picked up (become IN_USE)
 * - IN_USE vehicles can break down (MAINTENANCE) or run out of battery (CHARGING)
 * - Vehicles can go OUT_OF_SERVICE
 * - CHARGING vehicles eventually finish charging and return to AVAILABLE
 */
export const simulateVehicleStatusChanges = (): void => {
  vehicles = vehicles.map((v) => {
    const rand = Math.random() * 100;

    // AVAILABLE -> IN_USE (3% chance)
    if (v.status === "AVAILABLE" && rand < 3) {
      return { ...v, status: "IN_USE" };
    }

    // IN_USE -> MAINTENANCE (2% chance)
    if (v.status === "IN_USE" && rand < 2) {
      return { ...v, status: "MAINTENANCE" };
    }

    // IN_USE -> CHARGING if battery low (10% chance if below 25%)
    if (v.status === "IN_USE" && v.batteryLevel < 25 && rand < 10) {
      return { ...v, status: "CHARGING" };
    }

    // IN_USE -> OUT_OF_SERVICE (0.5% chance)
    if (v.status === "IN_USE" && rand < 0.5) {
      return { ...v, status: "OUT_OF_SERVICE" };
    }

    // CHARGING -> AVAILABLE (15% chance - charging completes)
    if (v.status === "CHARGING" && rand < 15) {
      return {
        ...v,
        status: "AVAILABLE",
        batteryLevel: Math.min(100, v.batteryLevel + 30),
      };
    }

    // MAINTENANCE -> AVAILABLE (5% chance - maintenance completes)
    if (v.status === "MAINTENANCE" && rand < 5) {
      return { ...v, status: "AVAILABLE" };
    }

    return v;
  });
};

// --- STORAGE KEY Export ---
export const VEHICLE_STORAGE_KEY = STORAGE_KEY;
