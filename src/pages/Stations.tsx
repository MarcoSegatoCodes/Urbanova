import { useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { Station } from "../types";
import {
  getAllStations,
  addStation,
  updateStation,
  deleteStation,
} from "../services";
import SearchInput from "../components/atoms/SearchInput";
import StationFilterPanel, {
  type FilterState,
} from "../components/molecules/StationFilterPanel";
import ConfirmDeleteModal from "../components/molecules/ConfirmDeleteModal";
import StationDetailModal from "../components/molecules/StationDetailModal";
import StationTable from "../components/organisms/StationTable";
import StationFormWizard from "../components/organisms/StationFormWizard";

type StationCreatePayload = Omit<Station, "id">;

export default function Stations() {
  const [stations, setStations] = useState<Station[]>(() => getAllStations());
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStationForView, setSelectedStationForView] =
    useState<Station | null>(null);
  const [formWizardOpen, setFormWizardOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | undefined>();

  function loadStations() {
    const loaded = getAllStations();
    setStations(loaded);
  }

  const filteredStations = useMemo(() => {
    let result = [...stations];

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.id.toLowerCase().includes(normalizedQuery) ||
          s.name.toLowerCase().includes(normalizedQuery) ||
          s.address.toLowerCase().includes(normalizedQuery) ||
          s.type.toLowerCase().includes(normalizedQuery) ||
          s.status.toLowerCase().includes(normalizedQuery),
      );
    }

    if (filters.statuses?.length) {
      result = result.filter((s) => filters.statuses!.includes(s.status));
    }
    if (filters.types?.length) {
      result = result.filter((s) => filters.types!.includes(s.type));
    }
    if (filters.hasAvailableDocks) {
      result = result.filter((s) => s.availableDocks > 0);
    }
    if (filters.hasChargingPorts) {
      result = result.filter((s) => s.chargingPorts > 0);
    }

    result.sort((a, b) => {
      const rawA = a[sortBy as keyof Station];
      const rawB = b[sortBy as keyof Station];

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
  }, [stations, searchQuery, filters, sortBy, sortOrder]);

  const handleAddStation = (data: StationCreatePayload): Station => {
    const newStation: Station = {
      ...data,
      id: `ST-${String(stations.length + 1).padStart(3, "0")}`,
    };
    addStation(newStation);
    loadStations();
    return newStation;
  };

  const handleUpdateStation = (
    id: string,
    data: Partial<Station>
  ): Station => {
    const updated = updateStation(id, data);
    if (!updated) throw new Error("Failed to update station");
    loadStations();
    return updated;
  };

  const handleDeleteStation = (id: string) => {
    setStationToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!stationToDelete) return;
    setIsLoading(true);
    try {
      deleteStation(stationToDelete);
      loadStations();
      setDeleteModalOpen(false);
      setStationToDelete(null);
      alert("Station deleted successfully");
    } catch {
      alert("Error deleting station");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStation = (id: string) => {
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
      setSelectedIds(new Set(filteredStations.map((s) => s.id)));
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

  const handleViewStation = (station: Station) => {
    setSelectedStationForView(station);
    setDetailModalOpen(true);
  };

  const handleEditStation = (station: Station) => {
    setEditingStation(station);
    setFormWizardOpen(true);
  };

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
              Station Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage your stations and their resources
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingStation(undefined);
              setFormWizardOpen(true);
            }}
          >
            Add Station
          </Button>
        </Box>

        {/* Search & Filters */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={1.5}>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Try a station ID, name, or address"
            />
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Showing {filteredStations.length} of {stations.length} stations
              </Typography>
              {searchQuery && (
                <Button size="small" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              )}
            </Stack>
            <StationFilterPanel onFilterChange={setFilters} />
          </Stack>
        </Paper>

        {/* Table */}
        <StationTable
          stations={filteredStations}
          selectedIds={selectedIds}
          onSelect={handleSelectStation}
          onSelectAll={handleSelectAll}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEditStation}
          onDelete={handleDeleteStation}
          onView={handleViewStation}
        />

        {/* Modals */}
        <StationFormWizard
          open={formWizardOpen}
          station={editingStation}
          onClose={() => {
            setFormWizardOpen(false);
            setEditingStation(undefined);
          }}
          onCreate={handleAddStation}
          onUpdate={handleUpdateStation}
          onCreated={() => {
            setFormWizardOpen(false);
            setEditingStation(undefined);
          }}
        />

        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          vehicleName={
            stations.find((s) => s.id === stationToDelete)?.name || ""
          }
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setStationToDelete(null);
          }}
          isLoading={isLoading}
        />

        <StationDetailModal
          isOpen={detailModalOpen}
          station={selectedStationForView}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedStationForView(null);
          }}
        />
      </Stack>
    </Container>
  );
}
