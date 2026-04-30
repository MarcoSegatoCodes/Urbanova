import { useState } from "react";
import { 
  Box, Typography, Paper, IconButton, Container, 
  Stack, Divider, useTheme, useMediaQuery
} from "@mui/material";
import { 
  Fullscreen, FullscreenExit, 
  Dashboard as DashIcon, Sensors as SensorsIcon
} from "@mui/icons-material";
import MapSandbox from "../components/MapSandbox";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isFullMap, setIsFullMap] = useState(false);

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100%',
      transition: 'all 0.4s ease-in-out',
      pb: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      <Container maxWidth="lg" sx={{ 
        pt: isFullMap ? 0 : 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center' 
      }}>
        
        {!isFullMap && (
          <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center', mb: 6, width: '100%' }}>
            
            {/* Badge */}
            <Stack direction="row" spacing={1.5} sx={{ 
              alignItems: 'center', 
              px: 2, py: 0.5, 
              borderRadius: '20px', 
              bgcolor: '#fff',
              border: '1px solid #e2e8f0',
            }}>
              <DashIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 1.5, color: '#64748b' }}>
                SYSTEM ACTIVE
              </Typography>
            </Stack>

            <Box sx={{ width: '100%' }}>
              <Typography variant={isMobile ? "h3" : "h1"} sx={{ 
                fontWeight: 900, 
                lineHeight: 1, 
                letterSpacing: '-0.05em',
                mb: 2,
                color: '#0f172a'
              }}>
                Urbanova <br/> 
                <span style={{ color: '#3b82f6' }}>Real-time Hub</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b", maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}>
                Centralized platform for urban micro-mobility monitoring and fleet management.
              </Typography>
            </Box>

            <Paper sx={{ 
              p: 0, 
              borderRadius: 3, 
              bgcolor: '#fff', 
              border: '1px solid #e2e8f0',
              width: '100%',
              maxWidth: '600px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ alignItems: 'center' }}>
                <Box sx={{ flex: 1, py: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>STATUS</Typography>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', alignItems: 'center', mt: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e' }} />
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>Online</Typography>
                  </Stack>
                </Box>
                <Box sx={{ flex: 1, py: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>LATENCY</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>24ms</Typography>
                </Box>
                <Box sx={{ flex: 1, py: 2 }}>
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, display: 'block' }}>UPTIME</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5, color: '#3b82f6' }}>99.9%</Typography>
                </Box>
              </Stack>
            </Paper>

          </Stack>
        )}

        <Box sx={{ 
          width: "100%", 
          maxWidth: isFullMap ? "100%" : "1000px", 
          position: 'relative',
          mt: isFullMap ? 0 : 2
        }}>
          <Paper
            elevation={isFullMap ? 0 : 4}
            sx={{
              position: isFullMap ? "fixed" : "relative",
              top: isFullMap ? 0 : "auto",
              left: isFullMap ? 0 : "auto",
              right: isFullMap ? 0 : "auto",
              bottom: isFullMap ? 0 : "auto",
              zIndex: isFullMap ? 2000 : 10,
              height: isFullMap ? "100vh" : "550px",
              width: "100%",
              borderRadius: isFullMap ? 0 : 4,
              overflow: "hidden",
              border: isFullMap ? 'none' : "1px solid #e2e8f0",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
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

            <MapSandbox />
          </Paper>

          {!isFullMap && (
            <Stack direction="row" sx={{ mt: 3, justifyContent: 'center', gap: 4, opacity: 0.5 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <SensorsIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Active Nodes: 1,240</Typography>
                </Stack>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>© 2026 Urbanova Intelligence</Typography>
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
}
