import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MapIcon from "@mui/icons-material/Map";

export const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<VisibilityIcon />}
        fullWidth
        onClick={() => navigate("/vehicles")}
      >
        View Vehicles
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<MapIcon />}
        fullWidth
        onClick={() => navigate("/map")}
      >
        View Full Map
      </Button>
    </Box>
  );
};
