// components/Vehicle/organisms/VehicleTable.tsx
import { useRef, useEffect } from "react";
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
} from "@mui/material";
import type { Vehicle } from "../../types";
import VehicleTableRow from "../molecules/VehicleTableRow";

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

const columnConfig = [
  { key: "name", label: "Name", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "batteryLevel", label: "Battery", sortable: true },
  { key: "lastMaintenanceDate", label: "Last Maintenance", sortable: true },
  { key: "nextMaintenanceDue", label: "Next Maintenance", sortable: true },
  { key: "currentStationId", label: "Station", sortable: false },
  { key: "totalTrips", label: "Trips", sortable: true },
  { key: "totalKmTraveled", label: "Distance", sortable: true },
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
  const checkboxRef = useRef<HTMLButtonElement | null>(null);

  const allSelected =
    vehicles.length > 0 && selectedIds.size === vehicles.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  useEffect(() => {
    const input = checkboxRef.current?.querySelector("input");

    if (input) {
      (input as HTMLInputElement).indeterminate = someSelected;
    }
  }, [someSelected]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                ref={checkboxRef}
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
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columnConfig.length + 1}
                align="center"
                sx={{ py: 4 }}
              >
                No vehicles found
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <VehicleTableRow
                key={vehicle.id}
                vehicle={vehicle}
                selected={selectedIds.has(vehicle.id)}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
