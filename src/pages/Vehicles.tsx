// components/Vehicle/Vehicle.tsx
import { useState, useEffect } from "react";
import { Container, Box, Typography, Button, Grid, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Vehicle, VehicleStatus } from "../types";
import vehiclesData from "../data/vehicles.json";
import {
  initVehicles,
  getAllVehicles,
  addVehicle,
  updateVehicle,
  updateVehicleStatus,
  assignVehicleToStation,
} from "../services";
import SearchInput from "../components/atoms/SearchInput";
import VehicleFilterPanel, {
  type FilterState,
} from "../components/molecules/VehicleFilterPanel";
import ConfirmDeleteModal from "../components/molecules/ConfirmDeleteModal";
import VehicleTable from "../components/organisms/VehicleTable";
import VehicleForm from "../components/organisms/VehicleForm";
import BulkActionsBar from "../components/organisms/BulkActionsBar";

type ViewMode = "list" | "add" | "edit";

export default function VehicleModule() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load vehicles on mount
  useEffect(() => {
    initVehicles(vehiclesData as Vehicle[]);
    loadVehicles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [vehicles, searchQuery, filters, sortBy, sortOrder]);

  const loadVehicles = () => {
    const loaded = getAllVehicles();
    setVehicles(loaded);
  };

  const applyFiltersAndSearch = () => {
    let result = [...vehicles];

    // Search
    if (searchQuery) {
      result = result.filter(
        (v) =>
          v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filters
    if (filters.status) {
      result = result.filter((v) => v.status === filters.status);
    }
    if (filters.type) {
      result = result.filter((v) => v.type === filters.type);
    }
    if (filters.batteryMin !== undefined) {
      result = result.filter((v) => v.batteryLevel >= filters.batteryMin!);
    }
    if (filters.batteryMax !== undefined) {
      result = result.filter((v) => v.batteryLevel <= filters.batteryMax!);
    }
    if (filters.station) {
      result = result.filter((v) => v.currentStationId === filters.station);
    }
    if (filters.maintenanceDue) {
      const now = new Date();
      result = result.filter((v) => new Date(v.nextMaintenanceDue) <= now);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Vehicle];
      let bVal: any = b[sortBy as keyof Vehicle];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    setFilteredVehicles(result);
  };

  const handleAddVehicle = (data: any) => {
    setIsLoading(true);
    try {
      const newVehicle: Vehicle = {
        ...data,
        id: `VH-${Date.now()}`,
        dateAdded: new Date().toISOString().split("T")[0],
      };
      addVehicle(newVehicle);
      loadVehicles();
      setViewMode("list");
      alert("Vehicle added successfully!");
    } catch (error) {
      alert("Error adding vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setViewMode("edit");
  };

  const handleUpdateVehicle = (data: any) => {
    setIsLoading(true);
    try {
      updateVehicle(data.id, data);
      loadVehicles();
      setViewMode("list");
      setEditingVehicle(undefined);
      alert("Vehicle updated successfully!");
    } catch (error) {
      alert("Error updating vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicleToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!vehicleToDelete) return;
    setIsLoading(true);
    try {
      updateVehicleStatus(vehicleToDelete, "OUT_OF_SERVICE");
      loadVehicles();
      setDeleteModalOpen(false);
      setVehicleToDelete(null);
      alert("Vehicle retired successfully");
    } catch (error) {
      alert("Error deleting vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkStatusChange = (status: VehicleStatus) => {
    setIsLoading(true);
    try {
      selectedIds.forEach((id) => updateVehicleStatus(id, status));
      loadVehicles();
      setSelectedIds(new Set());
      alert(`Status updated for ${selectedIds.size} vehicle(s)`);
    } catch (error) {
      alert("Error updating status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAssignStation = (stationId: string) => {
    if (!stationId.trim()) return;
    setIsLoading(true);
    try {
      selectedIds.forEach((id) => assignVehicleToStation(id, stationId));
      loadVehicles();
      setSelectedIds(new Set());
      alert(`Assigned ${selectedIds.size} vehicle(s) to ${stationId}`);
    } catch (error) {
      alert("Error assigning station");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} vehicle(s)?`)) {
      setIsLoading(true);
      try {
        selectedIds.forEach((id) => updateVehicleStatus(id, "OUT_OF_SERVICE"));
        loadVehicles();
        setSelectedIds(new Set());
        alert(`${selectedIds.size} vehicle(s) retired`);
      } catch (error) {
        alert("Error retiring vehicles");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectVehicle = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedIds(new Set(filteredVehicles.map((v) => v.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Render based on view mode
  if (viewMode === "add" || viewMode === "edit") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={viewMode === "add" ? handleAddVehicle : handleUpdateVehicle}
          onCancel={() => {
            setViewMode("list");
            setEditingVehicle(undefined);
          }}
          isLoading={isLoading}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Fleet Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your vehicle fleet
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setViewMode("add")}
          >
            Add Vehicle
          </Button>
        </Box>

        {/* Search & Filters */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <VehicleFilterPanel onFilterChange={setFilters} />
          </Grid>
        </Grid>

        {/* Bulk Actions */}
        <BulkActionsBar
          selectedCount={selectedIds.size}
          onChangeStatus={handleBulkStatusChange}
          onAssignStation={handleBulkAssignStation}
          onDelete={handleBulkDelete}
          isLoading={isLoading}
        />

        {/* Table */}
        <VehicleTable
          vehicles={filteredVehicles}
          selectedIds={selectedIds}
          onSelect={handleSelectVehicle}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEditVehicle}
          onDelete={handleDeleteVehicle}
        />

        {/* Delete Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          vehicleName={
            vehicles.find((v) => v.id === vehicleToDelete)?.name || ""
          }
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setVehicleToDelete(null);
          }}
          isLoading={isLoading}
        />
      </Stack>
    </Container>
  );
}
