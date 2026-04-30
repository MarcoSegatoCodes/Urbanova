// components/Vehicle/molecules/VehicleFilterPanel.tsx
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Slider,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { VehicleStatus, VehicleType } from "../../types";
import { getAllStations } from "../../services";

interface Props {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  statuses?: VehicleStatus[];
  types?: VehicleType[];
  batteryMin?: number;
  batteryMax?: number;
  station?: string;
  maintenanceDue?: boolean;
}

const vehicleStatuses: VehicleStatus[] = [
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "CHARGING",
  "OUT_OF_SERVICE",
];

const vehicleTypes: VehicleType[] = [
  "BIKE",
  "SCOOTER",
  "CAR",
  "ELECTRIC_CAR",
  "BUS",
  "ELECTRIC_BUS",
];

const statusLabels: Record<string, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
  CHARGING: "Charging",
  OUT_OF_SERVICE: "Out of Service",
};

const typeLabels: Record<string, string> = {
  BIKE: "Bike",
  SCOOTER: "Scooter",
  CAR: "Car",
  ELECTRIC_CAR: "Electric Car",
  BUS: "Bus",
  ELECTRIC_BUS: "Electric Bus",
};

const countActiveFilters = (filters: FilterState): number => {
  let count = 0;
  if (filters.statuses?.length) count++;
  if (filters.types?.length) count++;
  if (filters.batteryMin !== undefined || filters.batteryMax !== undefined)
    count++;
  if (filters.station) count++;
  if (filters.maintenanceDue) count++;
  return count;
};

export default function VehicleFilterPanel({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(true);
  const [stations, setStations] = useState<any[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setStations(getAllStations());
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange(newFilters);
    }, 300);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const toggleStatus = (status: VehicleStatus) => {
    const statuses = filters.statuses || [];
    const newStatuses = statuses.includes(status)
      ? statuses.filter((s) => s !== status)
      : [...statuses, status];
    handleFilterChange({
      ...filters,
      statuses: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const toggleType = (type: VehicleType) => {
    const types = filters.types || [];
    const newTypes = types.includes(type)
      ? types.filter((t) => t !== type)
      : [...types, type];
    handleFilterChange({
      ...filters,
      types: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const filterCount = countActiveFilters(filters);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ pb: "16px !important" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={0.8} sx={{ alignItems: "center" }}>
            <FilterListIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            {filterCount > 0 && (
              <Chip
                label={filterCount}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {filterCount > 0 && (
              <Button
                size="small"
                onClick={resetFilters}
                sx={{ fontSize: "0.75rem" }}
              >
                Reset
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setShowFilters((prev) => !prev)}
              endIcon={
                showFilters ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )
              }
              sx={{ fontSize: "0.75rem" }}
            >
              {showFilters ? "Hide" : "Show"}
            </Button>
          </Stack>
        </Box>

        {showFilters && (
          <Stack spacing={1.5}>
            {/* Status Filter */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  display: "block",
                  mb: 0.8,
                }}
              >
                Status
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {vehicleStatuses.map((status) => (
                  <Chip
                    key={status}
                    label={statusLabels[status]}
                    onClick={() => toggleStatus(status)}
                    variant={
                      filters.statuses?.includes(status) ? "filled" : "outlined"
                    }
                    color={
                      filters.statuses?.includes(status) ? "primary" : "default"
                    }
                    size="small"
                    sx={{ fontSize: "0.75rem" }}
                  />
                ))}
              </Box>
            </Box>

            {/* Type Filter */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  display: "block",
                  mb: 0.8,
                }}
              >
                Vehicle Type
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {vehicleTypes.map((type) => (
                  <Chip
                    key={type}
                    label={typeLabels[type]}
                    onClick={() => toggleType(type)}
                    variant={
                      filters.types?.includes(type) ? "filled" : "outlined"
                    }
                    color={
                      filters.types?.includes(type) ? "primary" : "default"
                    }
                    size="small"
                    sx={{ fontSize: "0.75rem" }}
                  />
                ))}
              </Box>
            </Box>

            {/* Battery Slider */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  display: "block",
                  mb: 1,
                }}
              >
                Battery Level ({filters.batteryMin || 0}% -{" "}
                {filters.batteryMax || 100}%)
              </Typography>
              <Slider
                min={0}
                max={100}
                value={[filters.batteryMin || 0, filters.batteryMax || 100]}
                onChange={(_, value: number | number[]) => {
                  if (Array.isArray(value)) {
                    handleFilterChange({
                      ...filters,
                      batteryMin: value[0],
                      batteryMax: value[1],
                    });
                  }
                }}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 50, label: "50%" },
                  { value: 100, label: "100%" },
                ]}
                sx={{ mt: 2, mb: 1 }}
              />
            </Box>

            {/* Station Filter */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  display: "block",
                  mb: 0.8,
                }}
              >
                Current Station
              </Typography>
              <Select
                fullWidth
                size="small"
                value={filters.station || ""}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    station: e.target.value || undefined,
                  })
                }
                displayEmpty
                sx={{ fontSize: "0.875rem" }}
              >
                <MenuItem value="">All Stations</MenuItem>
                {stations.map((station) => (
                  <MenuItem key={station.id} value={station.id}>
                    {station.id} - {station.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {/* Maintenance Filter */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filters.maintenanceDue || false}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      maintenanceDue: e.target.checked || undefined,
                    })
                  }
                />
              }
              label={
                <Typography variant="caption">
                  Show maintenance due only
                </Typography>
              }
              sx={{ m: 0 }}
            />

            {/* Active Filters Display */}
            {filterCount > 0 && (
              <Box sx={{ p: 1, bgcolor: "action.hover", borderRadius: 1 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, display: "block", mb: 0.8 }}
                >
                  Applied Filters
                </Typography>
                <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                  {filters.statuses?.map((s) => (
                    <Chip
                      key={`status-${s}`}
                      label={statusLabels[s]}
                      size="small"
                      onDelete={() => toggleStatus(s)}
                      variant="filled"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  ))}
                  {filters.types?.map((t) => (
                    <Chip
                      key={`type-${t}`}
                      label={typeLabels[t]}
                      size="small"
                      onDelete={() => toggleType(t)}
                      variant="filled"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  ))}
                  {(filters.batteryMin !== undefined ||
                    filters.batteryMax !== undefined) && (
                    <Chip
                      label={`Battery: ${filters.batteryMin || 0}%-${filters.batteryMax || 100}%`}
                      size="small"
                      onDelete={() =>
                        handleFilterChange({
                          ...filters,
                          batteryMin: undefined,
                          batteryMax: undefined,
                        })
                      }
                      variant="filled"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  )}
                  {filters.station && (
                    <Chip
                      label={`Station: ${filters.station}`}
                      size="small"
                      onDelete={() =>
                        handleFilterChange({ ...filters, station: undefined })
                      }
                      variant="filled"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  )}
                  {filters.maintenanceDue && (
                    <Chip
                      label="Maintenance Due"
                      size="small"
                      onDelete={() =>
                        handleFilterChange({
                          ...filters,
                          maintenanceDue: undefined,
                        })
                      }
                      variant="filled"
                      sx={{ fontSize: "0.75rem" }}
                    />
                  )}
                </Stack>
              </Box>
            )}

            {filterCount > 0 && (
              <Button
                variant="outlined"
                onClick={resetFilters}
                fullWidth
                size="small"
                sx={{ fontSize: "0.75rem" }}
              >
                Clear All Filters
              </Button>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
