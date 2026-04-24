import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go Home
      </Button>
    </Box>
  );
}
