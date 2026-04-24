// TestServices.tsx — drop this anywhere to test
import { useEffect } from "react";

// Import your JSON data
import vehiclesData from "../data/vehicles.json";
import stationsData from "../data/stations.json";
import {
  initVehicles,
  initStations,
  getAllVehicles,
  getAllStations,
  // getVehiclesByStatus,
  getAvailableVehicles,
} from "../services";

export default function ServiceTests() {
  useEffect(() => {
    // Initialize with JSON data
    initVehicles(vehiclesData);
    initStations(stationsData);
  }, []);

  // Test the services
  const allVehicles = getAllVehicles();
  const allStations = getAllStations();
  const availableVehicles = getAvailableVehicles();

  console.log("All Vehicles:", allVehicles);
  console.log("All Stations:", allStations);
  console.log("Available Vehicles:", availableVehicles);

  return (
    <div style={{ padding: 20, fontFamily: "monospace" }}>
      <h2>Service Test Results</h2>
      <p>✅ Total Vehicles: {allVehicles.length}</p>
      <p>✅ Total Stations: {allStations.length}</p>
      <p>✅ Available Vehicles: {availableVehicles.length}</p>

      <h3>First Vehicle:</h3>
      <pre>{JSON.stringify(allVehicles[0], null, 2)}</pre>

      <h3>First Station:</h3>
      <pre>{JSON.stringify(allStations[0], null, 2)}</pre>
    </div>
  );
}
