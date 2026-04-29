import type { ComponentType } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  IconButton,
} from "@mui/material";
import {
  Home,
  DirectionsBus,
  Map,
  People,
  Analytics,
  Settings,
  DirectionsCar,
  Logout,
} from "@mui/icons-material";
import { routes } from "../router/routes";

// Logout function
const handleLogout = () => {
  localStorage.removeItem("auth");
  window.location.href = "/";
};

const drawerWidth = 240;

const iconMap: Record<string, ComponentType> = {
  Home: Home,
  Stations: Map,
  Trips: DirectionsBus,
  Vehicles: DirectionsCar,
  Users: People,
  Analytics: Analytics,
  Settings: Settings,
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = routes.find((r) => r.path === location.pathname);
  const pageTitle = currentRoute?.name || "Urbanova";

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Urbanova
        </Typography>
      </Toolbar>
      <List>
        {routes.filter((route) => route.path !== "/").map((route) => {
          const Icon = iconMap[route.name];
          return (
            <ListItem key={route.path} disablePadding>
              <ListItemButton
                selected={location.pathname === route.path}
                onClick={() => navigate(route.path)}
              >
                {Icon && (
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                )}
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleLogout}
            title="Logout"
          >
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
