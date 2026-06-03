import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";

export const QuickActionsWidget: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        fullWidth
        onClick={() => navigate("/vehicles")}
      >
        Add New Vehicle
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<MapIcon />}
        fullWidth
        onClick={() => navigate("/stations")}
      >
        View Full Map
      </Button>
    </Box>
  );
};
