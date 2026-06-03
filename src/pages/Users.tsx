import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  Chip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Visibility,
  VisibilityOff,
  LockOutlined,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} from "../services/UserService";
import type { User, UserRole, PassType } from "../types";
import SearchInput from "../components/atoms/SearchInput";
import UsersTable from "../components/organisms/UsersTable";
import RoleBadge from "../components/atoms/RoleBadge";

const ALLOWED_ROLES: UserRole[] = ["ADMIN", "TECHNICIAN"];
const ALL_ROLES: UserRole[] = ["ADMIN", "OPERATOR", "TECHNICIAN", "SUPPORT", "USER"];
const ALL_PASS_TYPES: PassType[] = ["NONE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  passType: PassType;
  passExpiryDate: string;
  balance: number;
}

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "USER",
  isActive: true,
  passType: "NONE",
  passExpiryDate: "",
  balance: 0,
};

function userToForm(user: User): FormState {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    role: user.role,
    isActive: user.isActive,
    passType: (user.passType as PassType) ?? "NONE",
    passExpiryDate: user.passExpiryDate ?? "",
    balance: user.balance ?? 0,
  };
}

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: 2,
      }}
    >
      <LockOutlined sx={{ fontSize: 64, color: "text.disabled" }} />
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Access Restricted
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Only Admins and Technicians can manage users.
      </Typography>
      <Button variant="outlined" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Box>
  );
}

export default function Users() {
  const { currentUser } = useAuth();

  if (!currentUser || !ALLOWED_ROLES.includes(currentUser.role as UserRole)) {
    return <AccessDenied />;
  }

  return <UsersPage currentUser={currentUser} />;
}

function UsersPage({ currentUser }: { currentUser: User }) {
  const [users, setUsers] = useState<User[]>(() => getAllUsers());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "inactive">("");
  const [sortBy, setSortBy] = useState("firstName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [error, setError] = useState<string | null>(null);

  function reload() {
    setUsers(getAllUsers());
  }

  const filtered = useMemo(() => {
    let result = [...users];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.id.toLowerCase().includes(q) ||
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q),
      );
    }

    if (roleFilter) result = result.filter((u) => u.role === roleFilter);
    if (statusFilter === "active") result = result.filter((u) => u.isActive);
    if (statusFilter === "inactive") result = result.filter((u) => !u.isActive);

    result.sort((a, b) => {
      const aVal = String(a[sortBy as keyof User] ?? "").toLowerCase();
      const bVal = String(b[sortBy as keyof User] ?? "").toLowerCase();
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [users, search, roleFilter, statusFilter, sortBy, sortOrder]);

  function handleSort(field: string) {
    if (sortBy === field) setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else { setSortBy(field); setSortOrder("asc"); }
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowPassword(false);
    setFormMode("add");
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setForm(userToForm(user));
    setFormErrors({});
    setShowPassword(false);
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
  }

  function validateForm(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Invalid email";
    if (formMode === "add" && !form.password) errs.password = "Required";
    if (form.passType !== "NONE" && !form.passExpiryDate)
      errs.passExpiryDate = "Required for this pass type";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;
    setError(null);

    try {
      if (formMode === "add") {
        const newUser: User = {
          id: `USR-${Date.now()}`,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          isActive: form.isActive,
          passType: form.passType !== "NONE" ? form.passType : "NONE",
          passExpiryDate: form.passType !== "NONE" ? form.passExpiryDate : undefined,
          balance: form.balance,
        };
        addUser(newUser);
      } else if (editingUser) {
        const updates: Partial<User> = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          role: form.role,
          isActive: form.isActive,
          passType: form.passType,
          passExpiryDate: form.passType !== "NONE" ? form.passExpiryDate : undefined,
          balance: form.balance,
        };
        if (form.password) updates.password = form.password;
        updateUser(editingUser.id, updates);
      }
      reload();
      setFormOpen(false);
    } catch {
      setError("Failed to save user. Please try again.");
    }
  }

  function handleToggleActive(user: User) {
    updateUserStatus(user.id, user.isActive ? "INACTIVE" : "ACTIVE");
    reload();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    reload();
    setDeleteTarget(null);
  }

  const f = form;
  const setF = (patch: Partial<FormState>) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {users.length} users registered
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={openAdd}>
            Add User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Search + Filters */}
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
          <Stack spacing={1.5}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name, email, ID, or role"
            />
            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              <TextField
                select
                label="Role"
                size="small"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | "")}
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="">All roles</MenuItem>
                {ALL_ROLES.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Status"
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "" | "active" | "inactive")}
                sx={{ minWidth: 130 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", alignSelf: "center", ml: "auto" }}
              >
                Showing {filtered.length} of {users.length}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Table */}
        <UsersTable
          users={filtered}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onView={setViewUser}
          onEdit={openEdit}
          onToggleActive={handleToggleActive}
          onDelete={setDeleteTarget}
          currentUserId={currentUser.id}
        />
      </Stack>

      {/* ── Add / Edit Form Dialog ── */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {formMode === "add" ? "Add User" : "Edit User"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 0.5 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                fullWidth
                size="small"
                value={f.firstName}
                onChange={(e) => setF({ firstName: e.target.value })}
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
              />
              <TextField
                label="Last Name"
                fullWidth
                size="small"
                value={f.lastName}
                onChange={(e) => setF({ lastName: e.target.value })}
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
              />
            </Stack>
            <TextField
              label="Email"
              type="email"
              fullWidth
              size="small"
              value={f.email}
              onChange={(e) => setF({ email: e.target.value })}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              label={formMode === "edit" ? "New Password (leave blank to keep)" : "Password"}
              type={showPassword ? "text" : "password"}
              fullWidth
              size="small"
              value={f.password}
              onChange={(e) => setF({ password: e.target.value })}
              error={!!formErrors.password}
              helperText={formErrors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Role"
                fullWidth
                size="small"
                value={f.role}
                onChange={(e) => setF({ role: e.target.value as UserRole })}
              >
                {ALL_ROLES.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Balance (€)"
                type="number"
                fullWidth
                size="small"
                value={f.balance}
                onChange={(e) => setF({ balance: parseFloat(e.target.value) || 0 })}
              />
            </Stack>
            <Divider />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Pass Type"
                fullWidth
                size="small"
                value={f.passType}
                onChange={(e) => setF({ passType: e.target.value as PassType })}
              >
                {ALL_PASS_TYPES.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>
              {f.passType !== "NONE" && (
                <TextField
                  label="Pass Expiry"
                  type="date"
                  fullWidth
                  size="small"
                  value={f.passExpiryDate}
                  onChange={(e) => setF({ passExpiryDate: e.target.value })}
                  error={!!formErrors.passExpiryDate}
                  helperText={formErrors.passExpiryDate}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={f.isActive}
                  onChange={(e) => setF({ isActive: e.target.checked })}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  Account active
                </Typography>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {formMode === "add" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── View Detail Dialog ── */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth="xs" fullWidth>
        {viewUser && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {viewUser.firstName} {viewUser.lastName}
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={1.5}>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {viewUser.id}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>Email</Typography>
                  <Typography variant="body2">{viewUser.email}</Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>Role</Typography>
                  <RoleBadge role={viewUser.role} />
                </Stack>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>Status</Typography>
                  <Chip
                    size="small"
                    label={viewUser.isActive ? "Active" : "Inactive"}
                    color={viewUser.isActive ? "success" : "default"}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                {viewUser.passType && viewUser.passType !== "NONE" && (
                  <>
                    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>Pass</Typography>
                      <Typography variant="body2">{viewUser.passType}</Typography>
                    </Stack>
                    {viewUser.passExpiryDate && (
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>Expires</Typography>
                        <Typography variant="body2">
                          {new Date(viewUser.passExpiryDate).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    )}
                  </>
                )}
                {viewUser.balance !== undefined && (
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>Balance</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      €{viewUser.balance.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>Last login</Typography>
                  <Typography variant="body2">
                    {viewUser.lastLoginAt
                      ? new Date(viewUser.lastLoginAt).toLocaleString()
                      : "Never"}
                  </Typography>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewUser(null)}>Close</Button>
              <Button
                variant="outlined"
                onClick={() => { setViewUser(null); openEdit(viewUser); }}
              >
                Edit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        {deleteTarget && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Delete User</DialogTitle>
            <DialogContent>
              <Typography variant="body2">
                Permanently delete{" "}
                <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>{" "}
                ({deleteTarget.email})? This cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
