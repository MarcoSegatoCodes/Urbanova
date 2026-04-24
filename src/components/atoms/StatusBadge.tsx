import { Chip } from "@mui/material";

import type { TicketStatus } from "../../types";

interface StatusBadgeProps {
  status: TicketStatus;
}

const colorByStatus: Record<
  string,
  "default" | "primary" | "warning" | "success" | "error"
> = {
  OPEN: "error",
  IN_PROGRESS: "warning",
  AWAITING_PARTS: "warning",
  RESOLVED: "success",
  CLOSED: "default",
  CANCELLED: "default",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Chip
      size="small"
      color={colorByStatus[status] || "default"}
      label={status.replace("_", " ")}
      sx={{ fontWeight: 600 }}
    />
  );
}
