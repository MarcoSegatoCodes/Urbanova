import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { ComponentType } from "react";
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
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Home,
  DirectionsBus,
  Map,
  Explore,
  People,
  Analytics,
  Settings,
  DirectionsCar,
  Assignment,
  Logout,
  Explore,
} from "@mui/icons-material";

import { routes } from "../router/routes";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

const iconMap: Record<string, ComponentType> = {
  Home: Home,
  Map: Explore,
  Stations: Map,
  Trips: DirectionsBus,
  Vehicles: DirectionsCar,
  Users: People,
  Tickets: Assignment,
  Analytics: Analytics,
  Settings: Settings,
};

const ROLE_COLORS: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  ADMIN: "error",
  OPERATOR: "primary",
  TECHNICIAN: "warning",
  SUPPORT: "info",
  USER: "default",
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const currentRoute = routes.find((r) => r.path === location.pathname);
  const pageTitle = currentRoute?.name || "Urbanova";

  const userInitials = currentUser
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`
    : "?";

  const visibleRoutes = routes.filter(
    (r) => !r.allowedRoles || r.allowedRoles.includes(currentUser?.role ?? ""),
  );

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Urbanova
        </Typography>
      </Toolbar>
      <List>
        {visibleRoutes.map((route) => {
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

          {currentUser && (
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1.5}>
              <Chip
                label={currentUser.role}
                size="small"
                color={ROLE_COLORS[currentUser.role] ?? "default"}
                sx={{ fontWeight: 600, fontSize: "0.7rem" }}
              />
              <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    bgcolor: "primary.dark",
                  }}
                >
                  {userInitials}
                </Avatar>
                <Typography variant="body2" sx={{ color: "inherit", fontWeight: 500 }}>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
              </Stack>
              <Tooltip title="Sign out">
                <IconButton
                  size="small"
                  sx={{ color: "inherit" }}
                  onClick={logout}
                >
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
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
