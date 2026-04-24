// components/Vehicle/molecules/VehicleTableRow.tsx
import {
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Vehicle } from "../../types";
import VehicleStatusBadge from "../atoms/VehicleStatusBadge";
import VehicleTypeBadge from "../atoms/VehicleTypeBadge";
import BatteryBar from "../atoms/BatteryBar";

interface Props {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}

export default function VehicleTableRow({
  vehicle,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const isMaintenanceDue = new Date(vehicle.nextMaintenanceDue) <= new Date();

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={() => onSelect(vehicle.id)} />
      </TableCell>
      <TableCell sx={{ fontWeight: "bold" }}>{vehicle.name}</TableCell>
      <TableCell>
        <VehicleTypeBadge type={vehicle.type} />
      </TableCell>
      <TableCell>
        <VehicleStatusBadge status={vehicle.status} />
      </TableCell>
      <TableCell>
        <BatteryBar level={vehicle.batteryLevel} size="small" />
      </TableCell>
      <TableCell>
        {new Date(vehicle.lastMaintenanceDate).toLocaleDateString()}
      </TableCell>
      <TableCell>
        {isMaintenanceDue ? (
          <Box sx={{ color: "error.main", fontWeight: "bold" }}>Due Soon</Box>
        ) : (
          new Date(vehicle.nextMaintenanceDue).toLocaleDateString()
        )}
      </TableCell>
      <TableCell>{vehicle.currentStationId}</TableCell>
      <TableCell>{vehicle.totalTrips}</TableCell>
      <TableCell>{vehicle.totalKmTraveled.toFixed(1)} km</TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(vehicle)}
            variant="text"
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(vehicle.id)}
            variant="text"
            color="error"
          >
            Delete
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
