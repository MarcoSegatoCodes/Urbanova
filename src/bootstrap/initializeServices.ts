import analyticsData from "../data/analytics.json";
import stationsData from "../data/stations.json";
import ticketsData from "../data/tickets.json";
import tripsData from "../data/trips.json";
import usersData from "../data/users.json";
import vehiclesData from "../data/vehicles.json";
import {
  initAnalytics,
  initMaintenanceTickets,
  initStations,
  initTrips,
  initUsers,
  initVehicles,
} from "../services";
import type { Analytics, Station, Ticket, Trip, User, Vehicle } from "../types";

let initialized = false;

export const initializeServices = (): void => {
  if (initialized) return;

  initVehicles(vehiclesData as Vehicle[]);
  initStations(stationsData as Station[]);
  initUsers(usersData as User[]);
  initTrips(tripsData as Trip[]);
  initMaintenanceTickets(ticketsData as Ticket[]);
  initAnalytics(analyticsData as Analytics);

  initialized = true;
};