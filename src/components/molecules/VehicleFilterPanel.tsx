// components/Vehicle/molecules/VehicleFilterPanel.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  Button,
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
const vehicleTypes: VehicleType[] = ["BIKE", "SCOOTER", "CAR", "BUS"];

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
  CHARGING: "Charging",
  OUT_OF_SERVICE: "Out of Service",
};

const typeLabels: Record<VehicleType, string> = {
  BIKE: "Bike",
  SCOOTER: "Scooter",
  CAR: "Car",
  BUS: "Bus",
};

export default function VehicleFilterPanel({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<FilterState>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const filterCount = Object.keys(filters).length;

  return (
    <Card>
      <CardContent>
        <Button
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            mb: 2,
            fontWeight: 600,
            color: "primary.main",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              pr: 2,
            }}
          >
            <span>🔍 Filters</span>
            {filterCount > 0 && (
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                ({filterCount} active)
              </Typography>
            )}
          </Box>
        </Button>

        <Collapse in={showFilters}>
          <Stack spacing={3}>
            {/* Status Filter */}
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
                      {statusLabels[status]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Type Filter */}
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
                      {typeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Battery Range */}
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
                  value={filters.batteryMin || 0}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      batteryMin: Number(e.target.value),
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Max"
                  size="small"
                  slotProps={{
                    input: {
                      inputProps: { min: 0, max: 100 },
                    },
                  }}
                  value={filters.batteryMax || 100}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      batteryMax: Number(e.target.value),
                    })
                  }
                />
              </Box>
            </Box>

            {/* Station Filter */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}
              >
                Current Station
              </Typography>
              <TextField
                label="Station ID (e.g., ST-001)"
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

            {/* Maintenance Due */}
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
              label={
                <Typography variant="body2">
                  ⚠️ Show only maintenance due soon
                </Typography>
              }
            />

            {/* Reset Button */}
            <Button
              variant="outlined"
              onClick={resetFilters}
              fullWidth
              sx={{ mt: 2 }}
            >
              Clear All Filters
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
