import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import type { StationType, StationStatus } from "../../types";

export interface FilterState {
  types?: StationType[];
  statuses?: StationStatus[];
  hasAvailableDocks?: boolean;
  hasChargingPorts?: boolean;
}

interface StationFilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

const STATION_TYPES: StationType[] = ["HYBRID", "BIKE_ONLY", "EV_ONLY", "PARKING"];
const STATION_STATUSES: StationStatus[] = ["OPERATIONAL", "MAINTENANCE", "OFFLINE", "COMING_SOON"];

export default function StationFilterPanel({
  onFilterChange,
}: StationFilterPanelProps) {

  return (
    <Stack spacing={2}>
      <FormControl size="small" fullWidth>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          multiple
          label="Filter by Type"
          defaultValue={[]}
          onChange={(e) => {
            const values = e.target.value as StationType[];
            onFilterChange({ types: values.length > 0 ? values : undefined });
          }}
        >
          {STATION_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth>
        <InputLabel>Filter by Status</InputLabel>
        <Select
          multiple
          label="Filter by Status"
          defaultValue={[]}
          onChange={(e) => {
            const values = e.target.value as StationStatus[];
            onFilterChange({ statuses: values.length > 0 ? values : undefined });
          }}
        >
          {STATION_STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                onFilterChange({ hasAvailableDocks: e.target.checked });
              }}
            />
          }
          label="Only stations with available docks"
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => {
                onFilterChange({ hasChargingPorts: e.target.checked });
              }}
            />
          }
          label="Only stations with charging ports"
        />
      </FormGroup>
    </Stack>
  );
}
