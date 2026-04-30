import { Box } from "@mui/material";
import MapSandbox from "../components/MapSandbox"; 

export default function MapPage() {
  return (
    <Box sx={{ 
      width: '100%', 
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <MapSandbox isFullMap={true} />
    </Box>
  );
}