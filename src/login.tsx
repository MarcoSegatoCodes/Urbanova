import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { keyframes } from "@emotion/react";
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
  Chip,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import usersData from "./data/users.json";

const isAuthenticated = () => localStorage.getItem("auth") === "true";
const float = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, -18px, 0) scale(1.04); }
  100% { transform: translate3d(0, 0, 0) scale(1); }
`;
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

function LoginForm() {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const demoUser = useMemo(
    () => usersData.find((user) => user.email === "admin@urbanova.com") ?? usersData[0],
    [],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const matchedUser = usersData.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password &&
        user.isActive,
    );

    if (matchedUser) {
      localStorage.setItem("auth", "true");
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => navigate("/home"), 600);
    } else {
      setError("Credenziali non valide. Usa le credenziali demo mostrate sotto.");
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        px: 2,
        py: 4,
        background:
          "radial-gradient(circle at top left, rgba(15, 76, 129, 0.18), transparent 34%), linear-gradient(135deg, #f3f7fb 0%, #dfeaf3 45%, #edf4f8 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-8%",
          left: "-6%",
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(33, 150, 243, 0.16)",
          filter: "blur(12px)",
          animation: `${float} 10s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          right: "-8%",
          bottom: "-10%",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(14, 116, 144, 0.14)",
          filter: "blur(18px)",
          animation: `${float} 14s ease-in-out infinite reverse`,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 4, md: 5 },
              borderRadius: 6,
              color: "#fff",
              background:
                "linear-gradient(145deg, rgba(9, 43, 77, 0.92) 0%, rgba(13, 73, 99, 0.88) 100%)",
              boxShadow: "0 24px 80px rgba(16, 39, 56, 0.18)",
              animation: `${fadeUp} 700ms ease`,
            }}
          >
            <Box>
              <Chip
                label="Urban mobility control"
                sx={{
                  mb: 3,
                  color: "#d9eef7",
                  bgcolor: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.3rem" },
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  maxWidth: 480,
                }}
              >
                La cabina di regia per la tua mobilit urbana.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 3,
                  maxWidth: 440,
                  color: "rgba(233, 244, 250, 0.82)",
                  lineHeight: 1.75,
                }}
              >
                Accedi per coordinare flotte, stazioni e operazioni da un&apos;interfaccia piu pulita e focalizzata.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "rgba(255,255,255,0.09)",
                }}
              >
                <Typography variant="overline" sx={{ color: "#a9d8ea" }}>
                  Accesso demo
                </Typography>
                <Typography variant="body2" sx={{ color: "#ffff" }}>Email: {demoUser?.email}</Typography>
                <Typography variant="body2" sx={{ color: "#ffff" }}>Password: {demoUser?.password}</Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "rgba(255, 255, 255, 0.09)",
                }}
              >
                <Typography variant="overline" sx={{ color: "#a9d8ea" }}>
                  Stato
                </Typography>
                <Typography variant="body2" sx={{ color: "#ffff" }}>
                  Monitoraggio, gestione e navigazione protetta.
                </Typography>
              </Paper>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4.5 },
              borderRadius: 6,
              bgcolor: "rgba(255, 255, 255, 0.82)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 24px 80px rgba(16, 39, 56, 0.12)",
              animation: `${fadeUp} 900ms ease`,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "#14324a", letterSpacing: "-0.03em" }}
              >
                Urbanova
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Accedi al pannello operativo.
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Login effettuato con successo!
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
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
                
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 3 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((current) => !current)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading || success}
                sx={{
                  py: 1.6,
                  fontWeight: 700,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #1767a8 0%, #0e7b88 100%)",
                }}
              >
                {isLoading ? "Accesso in corso..." : success ? "Accesso effettuato!" : "Accedi"}
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginForm;
