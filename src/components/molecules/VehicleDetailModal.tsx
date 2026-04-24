import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Stack,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { Vehicle } from "../../types";
import VehicleStatusBadge from "../atoms/VehicleStatusBadge";
import VehicleTypeBadge from "../atoms/VehicleTypeBadge";
import BatteryBar from "../atoms/BatteryBar";

interface Props {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
}

export default function VehicleDetailModal({
  isOpen,
  vehicle,
  onClose,
}: Props) {
  if (!vehicle) return null;

  const isMaintenanceDue = new Date(vehicle.nextMaintenanceDue) <= new Date();

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {vehicle.name}
        </Typography>
        <Button size="small" onClick={onClose} sx={{ minWidth: 0, p: 0.5 }}>
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          {/* Status & Type Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
            >
              Status & Type
            </Typography>
            <Stack direction="row" spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                >
                  Status
                </Typography>
                <VehicleStatusBadge status={vehicle.status} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
                >
                  Type
                </Typography>
                <VehicleTypeBadge type={vehicle.type} />
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Battery Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
            >
              Battery Level
            </Typography>
            <BatteryBar level={vehicle.batteryLevel} size="medium" />
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {vehicle.batteryLevel}%
            </Typography>
          </Box>

          <Divider />

          {/* Location Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
            >
              Location & Station
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Latitude
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vehicle.coordinates.lat.toFixed(4)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Longitude
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vehicle.coordinates.lng.toFixed(4)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Station
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vehicle.currentStationId}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Maintenance Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
            >
              Maintenance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Last Maintenance
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(vehicle.lastMaintenanceDate).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: isMaintenanceDue ? "#ffebee" : "#f5f5f5",
                    borderRadius: 1,
                    border: isMaintenanceDue ? "1px solid #f44336" : "none",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Next Maintenance
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: isMaintenanceDue ? "error.main" : "inherit",
                    }}
                  >
                    {isMaintenanceDue
                      ? "⚠️ Due Soon"
                      : new Date(
                          vehicle.nextMaintenanceDue,
                        ).toLocaleDateString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Usage Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.secondary" }}
            >
              Usage Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Total Trips
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {vehicle.totalTrips}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Total Distance
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {vehicle.totalKmTraveled.toFixed(1)} km
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Notes Section */}
          {vehicle.notes && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
                >
                  Notes
                </Typography>
                <Paper
                  elevation={0}
                  sx={{ p: 1.5, backgroundColor: "#f5f5f5", borderRadius: 1 }}
                >
                  <Typography variant="body2">{vehicle.notes}</Typography>
                </Paper>
              </Box>
            </>
          )}

          {/* Meta Section */}
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Vehicle ID: <strong>{vehicle.id}</strong> • Added:{" "}
              {new Date(vehicle.dateAdded).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
