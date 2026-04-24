// pages/Vehicles.tsx
import { useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Vehicle, VehicleStatus } from "../types";
import {
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
import VehicleDetailModal from "../components/molecules/VehicleDetailModal";
import VehicleTable from "../components/organisms/VehicleTable";
import VehicleForm from "../components/organisms/VehicleForm";
import BulkActionsBar from "../components/organisms/BulkActionsBar";

type ViewMode = "list" | "add" | "edit";
type VehicleCreatePayload = Omit<Vehicle, "id" | "dateAdded">;

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => getAllVehicles());
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVehicleForView, setSelectedVehicleForView] =
    useState<Vehicle | null>(null);

  function loadVehicles() {
    const loaded = getAllVehicles();
    setVehicles(loaded);
  }

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.id.toLowerCase().includes(normalizedQuery) ||
          v.name.toLowerCase().includes(normalizedQuery) ||
          v.type.toLowerCase().includes(normalizedQuery) ||
          v.status.toLowerCase().includes(normalizedQuery) ||
          v.currentStationId.toLowerCase().includes(normalizedQuery),
      );
    }

    if (filters.status) {
      result = result.filter((v) => v.status === filters.status);
    }
    if (filters.type) {
      result = result.filter((v) => v.type === filters.type);
    }
    if (filters.batteryMin !== undefined) {
      const minBattery = filters.batteryMin;
      result = result.filter((v) => v.batteryLevel >= minBattery);
    }
    if (filters.batteryMax !== undefined) {
      const maxBattery = filters.batteryMax;
      result = result.filter((v) => v.batteryLevel <= maxBattery);
    }
    if (filters.station) {
      result = result.filter((v) => v.currentStationId === filters.station);
    }
    if (filters.maintenanceDue) {
      const now = new Date();
      result = result.filter((v) => new Date(v.nextMaintenanceDue) <= now);
    }

    result.sort((a, b) => {
      const rawA = a[sortBy as keyof Vehicle];
      const rawB = b[sortBy as keyof Vehicle];

      const aVal =
        typeof rawA === "number" ? rawA : String(rawA ?? "").toLowerCase();
      const bVal =
        typeof rawB === "number" ? rawB : String(rawB ?? "").toLowerCase();

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      }

      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    return result;
  }, [vehicles, searchQuery, filters, sortBy, sortOrder]);

  const handleAddVehicle = (data: VehicleCreatePayload) => {
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
    } catch {
      alert("Error adding vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setViewMode("edit");
  };

  const handleUpdateVehicle = (data: Vehicle) => {
    setIsLoading(true);
    try {
      updateVehicle(data.id, data);
      loadVehicles();
      setViewMode("list");
      setEditingVehicle(undefined);
      alert("Vehicle updated successfully!");
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
      } catch {
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

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicleForView(vehicle);
    setDetailModalOpen(true);
  };

  const handleVehicleSubmit = (payload: Vehicle | VehicleCreatePayload) => {
    if ("id" in payload && "dateAdded" in payload) {
      handleUpdateVehicle(payload);
      return;
    }

    handleAddVehicle(payload);
  };

  // Render based on view mode
  if (viewMode === "add" || viewMode === "edit") {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleVehicleSubmit}
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
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, height: "100%" }}
            >
              <Stack spacing={1}>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Try a vehicle ID, name, or type"
                />
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Showing {filteredVehicles.length} of {vehicles.length} vehicles
                  </Typography>
                  {searchQuery && (
                    <Button size="small" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
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
          onView={handleViewVehicle}
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

        <VehicleDetailModal
          isOpen={detailModalOpen}
          vehicle={selectedVehicleForView}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedVehicleForView(null);
          }}
        />
      </Stack>
    </Container>
  );
}
