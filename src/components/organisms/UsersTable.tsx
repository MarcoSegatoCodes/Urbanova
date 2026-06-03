import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Box,
} from "@mui/material";
import {
  Edit,
  Delete,
  ToggleOn,
  ToggleOff,
  Visibility,
} from "@mui/icons-material";
import type { User } from "../../types";
import RoleBadge from "../atoms/RoleBadge";

interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  width?: number | string;
}

const COLUMNS: Column[] = [
  { id: "id", label: "ID", sortable: true, width: 100 },
  { id: "firstName", label: "Name", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "role", label: "Role", sortable: true, width: 120 },
  { id: "isActive", label: "Status", width: 100 },
  { id: "lastLoginAt", label: "Last Login", sortable: true, width: 160 },
  { id: "actions", label: "", width: 120 },
];

interface UsersTableProps {
  users: User[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
  onDelete: (user: User) => void;
  currentUserId?: string;
}

export default function UsersTable({
  users,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
  currentUserId,
}: UsersTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            {COLUMNS.map((col) => (
              <TableCell
                key={col.id}
                width={col.width}
                sx={{ fontWeight: 700, fontSize: "0.8rem" }}
              >
                {col.sortable ? (
                  <TableSortLabel
                    active={sortBy === col.id}
                    direction={sortBy === col.id ? sortOrder : "asc"}
                    onClick={() => onSort(col.id)}
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS.length} sx={{ textAlign: "center", py: 6 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  No users found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <TableRow
                  key={user.id}
                  hover
                  sx={{ opacity: user.isActive ? 1 : 0.6 }}
                >
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {user.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.firstName} {user.lastName}
                        {isSelf && (
                          <Chip
                            label="you"
                            size="small"
                            sx={{ ml: 1, height: 16, fontSize: "0.65rem" }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.isActive ? "Active" : "Inactive"}
                      color={user.isActive ? "success" : "default"}
                      sx={{ fontWeight: 600, fontSize: "0.72rem" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString()
                        : "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => onView(user)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(user)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isActive ? "Deactivate" : "Activate"}>
                        <IconButton
                          size="small"
                          color={user.isActive ? "warning" : "success"}
                          onClick={() => onToggleActive(user)}
                          disabled={isSelf}
                        >
                          {user.isActive ? (
                            <ToggleOff fontSize="small" />
                          ) : (
                            <ToggleOn fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(user)}
                            disabled={isSelf}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
