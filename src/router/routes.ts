/**
 * Route configuration
 * Add new routes here to make them available throughout the app
 *
 * Usage:
 * - path: URL path (use :param for dynamic segments)
 * - component: The React component to render
 * - name: Display name (useful for navigation)
 * - icon: Optional icon component for menu/navigation
 */
import { lazy, type ComponentType } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Stations = lazy(() => import("../pages/Stations"));
const Trips = lazy(() => import("../pages/Trips"));
const Vehicles = lazy(() => import("../pages/Vehicles"));
const Users = lazy(() => import("../pages/Users"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

export interface RouteConfig {
  path: string;
  component: ComponentType;
  name: string;
  icon?: ComponentType;
  isIndex?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
    isIndex: true,
  },
  {
    path: "/stations",
    component: Stations,
    name: "Stations",
  },
  {
    path: "/trips",
    component: Trips,
    name: "Trips",
  },
  {
    path: "/vehicles",
    component: Vehicles,
    name: "Vehicles",
  },
  {
    path: "/users",
    component: Users,
    name: "Users",
  },
  {
    path: "/analytics",
    component: Analytics,
    name: "Analytics",
  },
  {
    path: "/settings",
    component: Settings,
    name: "Settings",
  },
];

// 404 route - must be last
export const notFoundRoute: RouteConfig = {
  path: "*",
  component: NotFound,
  name: "Not Found",
};

/**
 * Helper to generate URL with params
 * @example generateUrl('/stations/:id', { id: '123' }) => '/stations/123'
 */
export function generateUrl(
  pattern: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`:${key}`, String(value)),
    pattern,
  );
}
