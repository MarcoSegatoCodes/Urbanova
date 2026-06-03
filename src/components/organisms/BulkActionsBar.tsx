// components/Vehicle/organisms/BulkActionsBar.tsx
import { useState } from "react";
import {
  Paper,
  Box,
  Chip,
  TextField,
  MenuItem,
  Button,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { VehicleStatus } from "../../types";

interface Props {
  selectedCount: number;
  onChangeStatus: (status: VehicleStatus) => void;
  onAssignStation: (stationId: string) => void;
  onDelete: () => void;
  isLoading?: boolean;
  onClearSelection?: () => void;
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
  onClearSelection,
}: Props) {
  if (selectedCount === 0) return null;

  const [stationDraft, setStationDraft] = useState("");
  const canAssign = stationDraft.trim().length > 0;
  const selectionLabel = `${selectedCount} vehicle${selectedCount !== 1 ? "s" : ""} selected`;

  const handleAssignStation = () => {
    const stationId = stationDraft.trim();
    if (!stationId || isLoading) return;
    onAssignStation(stationId);
    setStationDraft("");
  };

  return (
    <Paper
      sx={(theme) => ({
        p: 2,
        borderRadius: 2.5,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.16,
        )} 0%, ${alpha(theme.palette.info.light, 0.12)} 45%, ${alpha(
          theme.palette.warning.light,
          0.1,
        )} 100%)`,
        boxShadow: "0 14px 24px -20px rgba(20, 32, 50, 0.55)",
        position: "relative",
        overflow: "hidden",
      })}
    >
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: -70,
          right: -40,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${alpha(
            theme.palette.primary.main,
            0.25,
          )} 0%, transparent 65%)`,
          pointerEvents: "none",
        })}
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { md: "center" },
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={0.6} sx={{ alignItems: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              icon={<AutoAwesomeIcon fontSize="small" />}
              label="Selection active"
              size="small"
              sx={(theme) => ({
                fontWeight: 600,
                borderRadius: "999px",
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.dark,
              })}
            />
            <Chip
              label={selectionLabel}
              color="primary"
              size="small"
              sx={{ fontWeight: 700, borderRadius: "999px" }}
            />
            {onClearSelection && (
              <IconButton
                aria-label="Clear selection"
                size="small"
                onClick={onClearSelection}
                disabled={isLoading}
                sx={(theme) => ({
                  border: `1px solid ${alpha(
                    theme.palette.primary.main,
                    0.2,
                  )}`,
                  backgroundColor: alpha(theme.palette.common.white, 0.7),
                })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            Actions apply to all selected vehicles.
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          {/* Change Status */}
          <TextField
            select
            label="Change status"
            defaultValue=""
            disabled={isLoading}
            onChange={(e) => onChangeStatus(e.target.value as VehicleStatus)}
            size="small"
            SelectProps={{ displayEmpty: true }}
            sx={(theme) => ({
              minWidth: 190,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.common.white, 0.85),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.95),
                },
              },
            })}
          >
            <MenuItem value="" disabled>
              Choose status
            </MenuItem>
            {vehicleStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {statusLabels[status]}
              </MenuItem>
            ))}
          </TextField>

          {/* Assign Station */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <TextField
              label="Assign station"
              placeholder="ST-XXX"
              value={stationDraft}
              onChange={(e) => setStationDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAssignStation();
                }
              }}
              disabled={isLoading}
              size="small"
              sx={(theme) => ({
                minWidth: 190,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.common.white, 0.85),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.white, 0.95),
                  },
                },
              })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAssignStation}
              disabled={isLoading || !canAssign}
              startIcon={<PlaceIcon fontSize="small" />}
              size="small"
              sx={{ whiteSpace: "nowrap" }}
            >
              Assign
            </Button>
          </Stack>

          {/* Delete */}
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteOutlinedIcon />}
            onClick={onDelete}
            disabled={isLoading}
            size="small"
            sx={{ whiteSpace: "nowrap" }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
