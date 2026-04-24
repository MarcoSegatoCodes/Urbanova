// components/Vehicle/atoms/VehicleStatusBadge.tsx
import { Chip } from "@mui/material";
import type { VehicleStatus } from "../../types";

interface Props {
  status: VehicleStatus;
}

const statusConfig: Record<VehicleStatus, { color: any; label: string }> = {
  AVAILABLE: { color: "success", label: "Available" },
  IN_USE: { color: "info", label: "In Use" },
  MAINTENANCE: { color: "warning", label: "Maintenance" },
  CHARGING: { color: "secondary", label: "Charging" },
  OUT_OF_SERVICE: { color: "error", label: "Out of Service" },
};

export default function VehicleStatusBadge({ status }: Props) {
  const config = statusConfig[status] || { color: "default", label: status };

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant="filled"
      size="small"
    />
  );
}
