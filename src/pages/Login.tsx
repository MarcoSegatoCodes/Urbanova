import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  DirectionsBus,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { getLockoutUntil } from "../services/AuthService";

function formatCountdown(lockUntil: number): string {
  const ms = lockUntil - Date.now();
  if (ms <= 0) return "0s";
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [countdown, setCountdown] = useState<string | null>(null);
  const [lockUntil, setLockUntil] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (!lockUntil) return;
    const tick = setInterval(() => {
      if (Date.now() >= lockUntil) {
        setLockUntil(null);
        setCountdown(null);
        setError(null);
        clearInterval(tick);
      } else {
        setCountdown(formatCountdown(lockUntil));
      }
    }, 1000);
    setCountdown(formatCountdown(lockUntil));
    return () => clearInterval(tick);
  }, [lockUntil]);

  function validate(): boolean {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "This field is required";
    else if (!EMAIL_RE.test(email)) errs.email = "Please enter a valid email address";
    if (!password) errs.password = "This field is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const existing = getLockoutUntil(email);
    if (existing) {
      setLockUntil(existing);
      setError(`Too many attempts. Try again in ${formatCountdown(existing)}.`);
      return;
    }

    setLoading(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 600));

    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
      return;
    }

    if (result.error === "ACCOUNT_LOCKED") {
      setLockUntil(result.lockUntil ?? null);
      setError(
        `Too many attempts. Try again in ${result.lockUntil ? formatCountdown(result.lockUntil) : "a few minutes"}.`,
      );
    } else if (result.error === "ACCOUNT_INACTIVE") {
      setError("Your account is inactive. Contact your administrator.");
    } else {
      setError("Invalid email or password.");
    }
  }

  const isLocked = lockUntil !== null && Date.now() < lockUntil;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)",
        p: 2,
      }}
    >
      <Card elevation={8} sx={{ width: "100%", maxWidth: 420, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo / Brand */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mb: 1.5,
              }}
            >
              <DirectionsBus sx={{ color: "white", fontSize: 30 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
              UrbaNova
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Fleet Management System
            </Typography>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {isLocked && countdown ? `Too many attempts. Try again in ${countdown}.` : error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              disabled={loading || isLocked}
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              disabled={loading || isLocked}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        tabIndex={-1}
                        disabled={loading || isLocked}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 1 }}
            />

            <Box sx={{ textAlign: "right", mb: 2.5 }}>
              <Link
                href="#"
                variant="body2"
                onClick={(e) => e.preventDefault()}
                sx={{ color: "primary.main" }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || isLocked}
              sx={{ borderRadius: 2, py: 1.25, fontWeight: 600 }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "inherit" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Demo credentials
            </Typography>
          </Divider>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Admin", email: "admin@urbanova.com", pw: "admin" },
              { label: "Technician", email: "tech@urbanova.com", pw: "tech" },
              { label: "Support", email: "support@urbanova.com", pw: "support" },
              { label: "User", email: "user@urbanova.com", pw: "user" },
            ].map(({ label, email: e, pw }) => (
              <Chip
                key={label}
                label={label}
                size="small"
                clickable
                disabled={loading || isLocked}
                onClick={() => {
                  setEmail(e);
                  setPassword(pw);
                  setFieldErrors({});
                  setError(null);
                }}
                sx={{ fontSize: "0.75rem" }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
