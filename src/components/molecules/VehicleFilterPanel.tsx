// components/Vehicle/molecules/VehicleFilterPanel.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Stack,
  Collapse,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import type { VehicleStatus, VehicleType } from "../../types";

interface Props {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  status?: VehicleStatus;
  type?: VehicleType;
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

const countActiveFilters = (filters: FilterState): number =>
  Object.values(filters).filter(
    (value) => value !== undefined && value !== "" && value !== false,
  ).length;

const toNumberOrUndefined = (raw: string): number | undefined => {
  if (!raw.trim()) return undefined;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return undefined;

  return parsed;
};

export default function VehicleFilterPanel({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const filterCount = countActiveFilters(filters);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <FilterListIcon color="primary" fontSize="small" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            {filterCount > 0 && (
              <Chip label={`${filterCount} active`} size="small" color="primary" />
            )}
          </Stack>

          <Stack direction="row" spacing={1}>
            {filterCount > 0 && (
              <Button size="small" onClick={resetFilters}>
                Reset
              </Button>
            )}
            <Button
              size="small"
              onClick={() => setShowFilters((prev) => !prev)}
              endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showFilters ? "Hide" : "Show"}
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 2 }}
        >
          Narrow results by status, type, battery range, station, and
          maintenance.
        </Typography>

        <Collapse in={showFilters}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
              >
                Status
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by status</InputLabel>
                <Select
                  value={filters.status || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      status: (e.target.value as VehicleStatus) || undefined,
                    })
                  }
                  label="Filter by status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {vehicleStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {statusLabels[status] || status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
              >
                Vehicle Type
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by type</InputLabel>
                <Select
                  value={filters.type || ""}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      type: (e.target.value as VehicleType) || undefined,
                    })
                  }
                  label="Filter by type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {vehicleTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {typeLabels[type] || type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
              >
                Battery Level (%)
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  type="number"
                  label="Min"
                  size="small"
                  slotProps={{ input: { inputProps: { min: 0, max: 100 } } }}
                  value={filters.batteryMin ?? ""}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      batteryMin: toNumberOrUndefined(e.target.value),
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Max"
                  size="small"
                  slotProps={{ input: { inputProps: { min: 0, max: 100 } } }}
                  value={filters.batteryMax ?? ""}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      batteryMax: toNumberOrUndefined(e.target.value),
                    })
                  }
                />
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
              >
                Current Station
              </Typography>
              <TextField
                label="Station ID (e.g. ST-001)"
                size="small"
                fullWidth
                value={filters.station || ""}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    station: e.target.value || undefined,
                  })
                }
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.maintenanceDue || false}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      maintenanceDue: e.target.checked || undefined,
                    })
                  }
                />
              }
              label={<Typography variant="body2">Show maintenance due only</Typography>}
            />

            <Button variant="outlined" onClick={resetFilters} fullWidth>
              Clear All Filters
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
