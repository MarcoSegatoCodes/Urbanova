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
import type { Trip } from "../../types";

interface Props {
  trips: Trip[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onView?: (trip: Trip) => void;
}

const columnConfig = [
  { key: "id", label: "Trip ID", sortable: true },
  { key: "vehicleId", label: "Vehicle", sortable: true },
  { key: "userId", label: "User", sortable: true },
  { key: "startStationId", label: "Start Station", sortable: true },
  { key: "endStationId", label: "End Station", sortable: true },
  { key: "startTime", label: "Start Time", sortable: true },
  { key: "distanceKm", label: "Distance (km)", sortable: true },
  { key: "co2SavedKg", label: "CO₂ Saved (kg)", sortable: true },
  { key: "actions", label: "Actions", sortable: false },
];

export default function TripsTable({
  trips,
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
  const allSelected = trips.length > 0 && selectedIds.size === trips.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  if (trips.length === 0) {
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

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    return `${minutes}m`;
  };

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
          {trips.map((trip) => (
            <TableRow
              key={trip.id}
              selected={selectedIds.has(trip.id)}
              hover
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedIds.has(trip.id)}
                  onChange={() => onSelect(trip.id)}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{trip.id}</TableCell>
              <TableCell>{trip.vehicleId}</TableCell>
              <TableCell>{trip.userId}</TableCell>
              <TableCell>{trip.startStationId}</TableCell>
              <TableCell>{trip.endStationId}</TableCell>
              <TableCell>
                {formatTime(trip.startTime)} ({getDuration(trip.startTime, trip.endTime)})
              </TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                {trip.distanceKm.toFixed(2)}
              </TableCell>
              <TableCell sx={{ textAlign: "right" }}>
                {trip.co2SavedKg.toFixed(2)}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5}>
                  {onView && (
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        onClick={() => onView(trip)}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(trip)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(trip.id)}
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
