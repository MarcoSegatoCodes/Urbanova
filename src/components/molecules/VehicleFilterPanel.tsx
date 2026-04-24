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
          sx={{ justifyContent: "flex-start", mb: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              pr: 2,
            }}
          >
            <span>Filters</span>
            {filterCount > 0 && (
              <Typography variant="caption">({filterCount})</Typography>
            )}
          </Box>
        </Button>

        <Collapse in={showFilters}>
          <Stack spacing={2}>
            {/* Status Filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status || ""}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    status: (e.target.value as VehicleStatus) || undefined,
                  })
                }
                label="Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {vehicleStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Type Filter */}
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type || ""}
                onChange={(e) =>
                  handleFilterChange({
                    ...filters,
                    type: (e.target.value as VehicleType) || undefined,
                  })
                }
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {vehicleTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Battery Range */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                type="number"
                label="Min Battery"
                size="small"
                sx={{ min: 0, max: 100 }}
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
                label="Max Battery"
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

            {/* Station Filter */}
            <TextField
              label="Station ID"
              size="small"
              value={filters.station || ""}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  station: e.target.value || undefined,
                })
              }
              placeholder="e.g., ST-001"
            />

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
              label="Maintenance due soon"
            />

            {/* Reset Button */}
            <Button variant="outlined" onClick={resetFilters} fullWidth>
              Reset Filters
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
