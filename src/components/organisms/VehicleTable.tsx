// components/Vehicle/organisms/VehicleTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Vehicle, VehicleType, VehicleStatus } from "../../types";
import VehicleStatusBadge from "../atoms/VehicleStatusBadge";
import VehicleTypeBadge from "../atoms/VehicleTypeBadge";
import BatteryBar from "../atoms/BatteryBar";

interface Props {
  vehicles: Vehicle[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onView?: (vehicle: Vehicle) => void;
}

const typeLabels: Record<VehicleType, string> = {
  BIKE: "Bike",
  SCOOTER: "Scooter",
  CAR: "Car",
  ELECTRIC_CAR: "Electric Car",
  BUS: "Bus",
  ELECTRIC_BUS: "Electric Bus",
};

const columnConfig = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "batteryLevel", label: "Battery", sortable: true },
  { key: "currentStationId", label: "Station", sortable: false },
  { key: "actions", label: "Actions", sortable: false },
];

export default function VehicleTable({
  vehicles,
  selectedIds,
  onSelect,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onView,
}: Props) {
  const allSelected =
    vehicles.length > 0 && selectedIds.size === vehicles.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  if (vehicles.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </TableCell>
              {columnConfig.map((col) => (
                <TableCell
                  key={col.key}
                  sortDirection={sortBy === col.key ? sortOrder : false}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortBy === col.key ? sortOrder : "asc"}
                      onClick={() => onSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                indeterminate={someSelected}
              />
            </TableCell>
            {columnConfig.map((col) => (
              <TableCell
                key={col.key}
                sortDirection={sortBy === col.key ? sortOrder : false}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortBy === col.key}
                    direction={sortBy === col.key ? sortOrder : "asc"}
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                ) : (
                  col.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow
              key={vehicle.id}
              selected={selectedIds.has(vehicle.id)}
              hover
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.has(vehicle.id)}
                  onChange={() => onSelect(vehicle.id)}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{vehicle.name}</TableCell>
              <TableCell>
                <VehicleTypeBadge type={vehicle.type} />
              </TableCell>
              <TableCell>
                <VehicleStatusBadge status={vehicle.status} />
              </TableCell>
              <TableCell>
                <BatteryBar level={vehicle.batteryLevel} />
              </TableCell>
              <TableCell>{vehicle.currentStationId}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  {onView && (
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        onClick={() => onView(vehicle)}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(vehicle)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(vehicle.id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
