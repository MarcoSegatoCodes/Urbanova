import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Layout from "./components/Layout";
import Home from "./pages/Home";

// Check autenticazione
const isAuthenticated = () => localStorage.getItem("auth") === "true";

// Componente ProtectedRoute
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Componente Login Form
function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo credentials
    if (email === "admin@urbanova.com" && password === "admin123") {
      localStorage.setItem("auth", "true");
      setSuccess(true);
      setIsLoading(false);
      // Redirect to home after success
      setTimeout(() => navigate("/home"), 1500);
    } else {
      setError("Credenziali non valide. Usa: admin@urbanova.com / admin123");
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 5, width: "100%", borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            Urbanova
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Transportation Management System
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Login effettuato con successo!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error} Credenziali non valide
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            placeholder="admin@urbanova.com"
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            placeholder="admin123"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || success}
            sx={{ py: 1.5, fontWeight: "bold" }}
          >
            {isLoading ? "Accesso in corso..." : success ? "Accesso effettuato!" : "Accedi"}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
          Demo: admin@urbanova.com / admin123
        </Typography>
      </Paper>
    </Container>
  );
}

export default LoginForm;