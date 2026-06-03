import { useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Trip } from "../types";
import {
  getAllTrips,
  addTrip,
  updateTrip,
  deleteTrip,
  getAllVehicles,
  getAllUsers,
  getAllStations,
} from "../services";
import SearchInput from "../components/atoms/SearchInput";
import TripsTable from "../components/organisms/TripsTable";

type TripCreatePayload = Omit<Trip, "id">;

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>(() => getAllTrips());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const vehicles = useMemo(() => getAllVehicles(), []);
  const users = useMemo(() => getAllUsers(), []);
  const stations = useMemo(() => getAllStations(), []);

  function loadTrips() {
    setTrips(getAllTrips());
  }

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(normalizedQuery) ||
          t.vehicleId.toLowerCase().includes(normalizedQuery) ||
          t.userId.toLowerCase().includes(normalizedQuery) ||
          t.startStationId.toLowerCase().includes(normalizedQuery) ||
          t.endStationId.toLowerCase().includes(normalizedQuery),
      );
    }

    result.sort((a, b) => {
      const rawA = a[sortBy as keyof Trip];
      const rawB = b[sortBy as keyof Trip];

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
  }, [trips, searchQuery, sortBy, sortOrder]);

  const handleAddTrip = (data: TripCreatePayload) => {
    const newTrip: Trip = {
      ...data,
      id: `TR-${Date.now()}`,
    };
    addTrip(newTrip);
    loadTrips();
    setFormOpen(false);
    setEditingTrip(undefined);
  };

  const handleUpdateTrip = (id: string, data: Partial<Trip>) => {
    updateTrip(id, data);
    loadTrips();
    setFormOpen(false);
    setEditingTrip(undefined);
  };

  const handleDeleteTrip = (id: string) => {
    setTripToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!tripToDelete) return;
    setIsLoading(true);
    try {
      deleteTrip(tripToDelete);
      loadTrips();
      setDeleteConfirmOpen(false);
      setTripToDelete(null);
      alert("Trip deleted successfully");
    } catch {
      alert("Error deleting trip");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Delete ${selectedIds.size} trip(s)?`)) {
      setIsLoading(true);
      try {
        selectedIds.forEach((id) => deleteTrip(id));
        loadTrips();
        setSelectedIds(new Set());
        alert(`${selectedIds.size} trip(s) deleted`);
      } catch {
        alert("Error deleting trips");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSelectTrip = (id: string) => {
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
      setSelectedIds(new Set(filteredTrips.map((t) => t.id)));
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

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setFormOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Trips Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              View and manage all trips
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTrip(undefined);
              setFormOpen(true);
            }}
          >
            Add Trip
          </Button>
        </Box>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={1.5}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by trip ID, vehicle, user, or station"
            />
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Showing {filteredTrips.length} of {trips.length} trips
              </Typography>
              {searchQuery && (
                <Button size="small" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>

        {selectedIds.size > 0 && (
          <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2">
                {selectedIds.size} trip(s) selected
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={handleBulkDelete}
                  color="error"
                  disabled={isLoading}
                >
                  Delete Selected
                </Button>
                <Button
                  size="small"
                  onClick={() => setSelectedIds(new Set())}
                  disabled={isLoading}
                >
                  Clear Selection
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        <TripsTable
          trips={filteredTrips}
          selectedIds={selectedIds}
          onSelect={handleSelectTrip}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />

        <TripFormDialog
          open={formOpen}
          trip={editingTrip}
          vehicles={vehicles}
          users={users}
          stations={stations}
          isLoading={isLoading}
          onClose={() => {
            setFormOpen(false);
            setEditingTrip(undefined);
          }}
          onCreate={handleAddTrip}
          onUpdate={handleUpdateTrip}
        />

        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Delete Trip</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this trip? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              disabled={isLoading}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Container>
  );
}

interface TripFormDialogProps {
  open: boolean;
  trip?: Trip;
  vehicles: any[];
  users: any[];
  stations: any[];
  isLoading: boolean;
  onClose: () => void;
  onCreate: (data: TripCreatePayload) => void;
  onUpdate: (id: string, data: Partial<Trip>) => void;
}

function TripFormDialog({
  open,
  trip,
  vehicles,
  users,
  stations,
  isLoading,
  onClose,
  onCreate,
  onUpdate,
}: TripFormDialogProps) {
  const [formData, setFormData] = useState<TripCreatePayload>(() =>
    trip
      ? {
          vehicleId: trip.vehicleId,
          userId: trip.userId,
          startStationId: trip.startStationId,
          endStationId: trip.endStationId,
          startTime: trip.startTime,
          endTime: trip.endTime,
          distanceKm: trip.distanceKm,
          co2SavedKg: trip.co2SavedKg,
        }
      : {
          vehicleId: "",
          userId: "",
          startStationId: "",
          endStationId: "",
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          distanceKm: 0,
          co2SavedKg: 0,
        },
  );

  const handleSubmit = () => {
    if (
      !formData.vehicleId ||
      !formData.userId ||
      !formData.startStationId ||
      !formData.endStationId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (trip) {
      onUpdate(trip.id, formData);
    } else {
      onCreate(formData);
    }
  };

  const handleChange = (field: keyof TripCreatePayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{trip ? "Edit Trip" : "Create New Trip"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="Vehicle *"
            value={formData.vehicleId}
            onChange={(e) => handleChange("vehicleId", e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} - {v.name}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="User *"
            value={formData.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} - {u.name}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="Start Station *"
            value={formData.startStationId}
            onChange={(e) => handleChange("startStationId", e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Select a station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="End Station *"
            value={formData.endStationId}
            onChange={(e) => handleChange("endStationId", e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="">Select a station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Start Time"
            type="datetime-local"
            value={formData.startTime.slice(0, 16)}
            onChange={(e) =>
              handleChange("startTime", new Date(e.target.value).toISOString())
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Time"
            type="datetime-local"
            value={formData.endTime.slice(0, 16)}
            onChange={(e) =>
              handleChange("endTime", new Date(e.target.value).toISOString())
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Distance (km)"
            type="number"
            value={formData.distanceKm}
            onChange={(e) => handleChange("distanceKm", parseFloat(e.target.value) || 0)}
            fullWidth
            inputProps={{ step: "0.1", min: "0" }}
          />

          <TextField
            label="CO₂ Saved (kg)"
            type="number"
            value={formData.co2SavedKg}
            onChange={(e) =>
              handleChange("co2SavedKg", parseFloat(e.target.value) || 0)
            }
            fullWidth
            inputProps={{ step: "0.01", min: "0" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
        >
          {trip ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
