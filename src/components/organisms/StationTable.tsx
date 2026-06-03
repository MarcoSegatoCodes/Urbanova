import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { Station } from "../../types";
import StatusBadge from "../atoms/StatusBadge";

interface StationTableProps {
  stations: Station[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onSelectAll: (select: boolean) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onEdit: (station: Station) => void;
  onDelete: (id: string) => void;
  onView: (station: Station) => void;
}

export default function StationTable({
  stations,
  selectedIds,
  onSelect,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onView,
}: StationTableProps) {
  const handleHeaderClick = (field: string) => {
    onSort(field);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={
                  selectedIds.size > 0 && selectedIds.size < stations.length
                }
                checked={stations.length > 0 && selectedIds.size === stations.length}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </TableCell>
            <TableCell
              onClick={() => handleHeaderClick("id")}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
                "&:hover": { backgroundColor: "#eeeeee" },
              }}
            >
              ID {sortBy === "id" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell
              onClick={() => handleHeaderClick("name")}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
                "&:hover": { backgroundColor: "#eeeeee" },
              }}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell>Address</TableCell>
            <TableCell
              onClick={() => handleHeaderClick("type")}
              sx={{
                cursor: "pointer",
                fontWeight: "bold",
                userSelect: "none",
                "&:hover": { backgroundColor: "#eeeeee" },
              }}
            >
              Type {sortBy === "type" && (sortOrder === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Available Docks</TableCell>
            <TableCell align="right">Available Bikes</TableCell>
            <TableCell align="right">Available EVs</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                No stations found
              </TableCell>
            </TableRow>
          ) : (
            stations.map((station) => (
              <TableRow
                key={station.id}
                selected={selectedIds.has(station.id)}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(station.id)}
                    onChange={() => onSelect(station.id)}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{station.id}</TableCell>
                <TableCell>{station.name}</TableCell>
                <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {station.address}
                </TableCell>
                <TableCell>{station.type}</TableCell>
                <TableCell>
                  <StatusBadge status={station.status} />
                </TableCell>
                <TableCell align="right">
                  {station.availableDocks}/{station.totalDocks}
                </TableCell>
                <TableCell align="right">{station.availableBikes}</TableCell>
                <TableCell align="right">{station.availableEVehicles}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => onView(station)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(station)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(station.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
