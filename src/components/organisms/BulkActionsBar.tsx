// components/Vehicle/organisms/BulkActionsBar.tsx
import {
  Paper,
  Box,
  Chip,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import type { VehicleStatus } from "../../types";

interface Props {
  selectedCount: number;
  onChangeStatus: (status: VehicleStatus) => void;
  onAssignStation: (stationId: string) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const vehicleStatuses: VehicleStatus[] = [
  "AVAILABLE",
  "IN_USE",
  "MAINTENANCE",
  "CHARGING",
  "OUT_OF_SERVICE",
];

const statusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Available",
  IN_USE: "In Use",
  MAINTENANCE: "Maintenance",
  CHARGING: "Charging",
  OUT_OF_SERVICE: "Out of Service",
};

export default function BulkActionsBar({
  selectedCount,
  onChangeStatus,
  onAssignStation,
  onDelete,
  isLoading = false,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <Paper sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <InfoIcon color="info" />
          <Chip
            label={`${selectedCount} vehicle${selectedCount !== 1 ? "s" : ""} selected`}
            color="info"
            variant="filled"
          />
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          {/* Change Status */}
          <Select
            defaultValue=""
            disabled={isLoading}
            onChange={(e) => onChangeStatus(e.target.value as VehicleStatus)}
            displayEmpty
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="" disabled>
              Change Status...
            </MenuItem>
            {vehicleStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </Select>

          {/* Assign Station */}
          <TextField
            placeholder="Assign to Station (ST-XXX)"
            onChange={(e) => {
              if (e.target.value) onAssignStation(e.target.value);
            }}
            disabled={isLoading}
            size="small"
            sx={{ minWidth: 200 }}
          />

          {/* Delete */}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
