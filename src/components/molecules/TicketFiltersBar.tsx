import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import type {
  SortDirection,
  TicketListFilters,
  TicketSortBy,
} from "../../types";
import {
  ISSUE_TYPE_OPTIONS,
  TICKET_PRIORITY_OPTIONS,
  TICKET_STATUS_OPTIONS,
} from "../../types/ticket.types";

interface TechnicianOption {
  id: string;
  label: string;
}

interface TicketFiltersBarProps {
  filters: TicketListFilters;
  sortBy: TicketSortBy;
  sortDirection: SortDirection;
  technicians: TechnicianOption[];
  onFiltersChange: (next: TicketListFilters) => void;
  onSortByChange: (value: TicketSortBy) => void;
  onSortDirectionChange: (value: SortDirection) => void;
  onReset: () => void;
}

export default function TicketFiltersBar({
  filters,
  sortBy,
  sortDirection,
  technicians,
  onFiltersChange,
  onSortByChange,
  onSortDirectionChange,
  onReset,
}: TicketFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(true);

  const setFilter = <K extends keyof TicketListFilters>(
    key: K,
    value: TicketListFilters[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="h6">Filters and Sorting</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showFilters}
                onChange={(event) => setShowFilters(event.target.checked)}
              />
            }
            label={showFilters ? "Hide Filters" : "Show Filters"}
          />
        </Stack>

        <Collapse in={showFilters}>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.hideInactive}
                  onChange={(event) =>
                    setFilter("hideInactive", event.target.checked)
                  }
                />
              }
              label="Hide Inactive Tasks"
            />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                label="Search"
                placeholder="Ticket ID, title, vehicle"
                value={filters.search}
                onChange={(event) => setFilter("search", event.target.value)}
                fullWidth
              />

              <TextField
                select
                label="Status"
                value={filters.status}
                onChange={(event) => setFilter("status", event.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="ALL">All</MenuItem>
                {TICKET_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Priority"
                value={filters.priority}
                onChange={(event) => setFilter("priority", event.target.value)}
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="ALL">All</MenuItem>
                {TICKET_PRIORITY_OPTIONS.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Issue Type"
                value={filters.issueType}
                onChange={(event) => setFilter("issueType", event.target.value)}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="ALL">All</MenuItem>
                {ISSUE_TYPE_OPTIONS.map((issueType) => (
                  <MenuItem key={issueType} value={issueType}>
                    {issueType.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Assigned Technician"
                value={filters.assignedTo}
                onChange={(event) => setFilter("assignedTo", event.target.value)}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="">Unassigned</MenuItem>
                {technicians.map((technician) => (
                  <MenuItem key={technician.id} value={technician.id}>
                    {technician.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Created From"
                type="date"
                value={filters.dateFrom}
                onChange={(event) => setFilter("dateFrom", event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ minWidth: 180 }}
              />

              <TextField
                label="Created To"
                type="date"
                value={filters.dateTo}
                onChange={(event) => setFilter("dateTo", event.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ minWidth: 180 }}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Sort By"
                value={sortBy}
                onChange={(event) =>
                  onSortByChange(event.target.value as TicketSortBy)
                }
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </TextField>

              <TextField
                select
                label="Direction"
                value={sortDirection}
                onChange={(event) =>
                  onSortDirectionChange(event.target.value as SortDirection)
                }
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </TextField>

              <Button
                variant="outlined"
                onClick={onReset}
                sx={{ alignSelf: "center" }}
              >
                Reset Filters
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </Box>
  );
}
