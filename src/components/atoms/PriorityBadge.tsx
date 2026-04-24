import { Chip } from "@mui/material";

import type { TicketPriority } from "../../types";

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const colorByPriority: Record<string, "default" | "success" | "warning" | "error"> = {
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "error",
  CRITICAL: "error",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Chip
      size="small"
      color={colorByPriority[priority] || "default"}
      label={priority.replace("_", " ")}
      sx={{ fontWeight: 600 }}
    />
  );
}
