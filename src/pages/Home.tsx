import { useState } from "react";
import { 
  Box, Typography, Paper, IconButton, Stack, useTheme, useMediaQuery
} from "@mui/material";
import { 
  Fullscreen, FullscreenExit
} from "@mui/icons-material";
import MapSandbox from "../components/MapSandbox";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFullMap, setIsFullMap] = useState(false);

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      p: isFullMap ? 0 : { xs: 2, md: 3 }, 
      gap: isFullMap ? 0 : 2, 
      bgcolor: '#f8fafc'
    }}>
      {!isFullMap && (
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          sx={{ 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            mb: 1,
            gap: 2
          }}
        >
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>
              Fleet <span style={{ color: '#3b82f6' }}>Overview</span>
            </Typography>
          </Box>

          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>Online</Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>LATENCY</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>24ms</Typography>
            </Paper>
            
            <Paper elevation={0} sx={{ px: 2, py: 1, borderRadius: 2, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>UPTIME</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#3b82f6' }}>99.9%</Typography>
            </Paper>
          </Stack>
        </Stack>
      )}

      <Paper
        elevation={isFullMap ? 0 : 3}
        sx={{
          ...(isFullMap ? {
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            borderRadius: 0,
            border: 'none',
          } : {
            position: "relative",
            flexGrow: 1, 
            width: "100%",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
          }),
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: 15, right: 15, zIndex: 3000 }}>
          <IconButton
            onClick={() => setIsFullMap(!isFullMap)}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#0f172a",
              "&:hover": { bgcolor: "#fff" },
              boxShadow: 2
            }}
          >
            {isFullMap ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>

        <MapSandbox key={isFullMap ? "fullscreen" : "normal"} />
      </Paper>
    </Box>
  );
}
