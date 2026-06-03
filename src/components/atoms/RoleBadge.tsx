import { Chip } from "@mui/material";
import type { UserRole } from "../../types";

const colorMap: Record<
  string,
  "default" | "error" | "primary" | "warning" | "info" | "success"
> = {
  ADMIN: "error",
  OPERATOR: "primary",
  TECHNICIAN: "warning",
  SUPPORT: "info",
  USER: "default",
};

export default function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Chip
      size="small"
      label={role}
      color={colorMap[role] ?? "default"}
      sx={{ fontWeight: 600, fontSize: "0.72rem" }}
    />
  );
}
