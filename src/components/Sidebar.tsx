import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider 
} from "@mui/material";
import { 
  Home as HomeIcon, 
  Map as MapIcon,
  DirectionsBike as BikeIcon, 
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  EvStation as StationIcon
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { text: "Home", icon: HomeIcon, path: "/" },
  { text: "Live Map", icon: MapIcon, path: "/map" },
  { text: "Stations", icon: StationIcon, path: "/stations" },
  { text: "Trips", icon: BikeIcon, path: "/trips" },
  { text: "Vehicles", icon: BikeIcon, path: "/vehicles" },
  { text: "Users", icon: PeopleIcon, path: "/users" },
  { text: "Analytics", icon: AnalyticsIcon, path: "/analytics" },
  { text: "Settings", icon: SettingsIcon, path: "/settings" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>
          Urbanova
        </Typography>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <List sx={{ px: 2, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "rgba(59, 130, 246, 0.08)",
                    "&:hover": { bgcolor: "rgba(59, 130, 246, 0.12)" },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon sx={{ 
                    fontSize: '1.25rem', 
                    color: isActive ? '#3b82f6' : '#64748b' 
                  }} />
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.text} 
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#0f172a' : '#64748b'
                      }
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}