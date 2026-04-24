import { lazy } from "react";

// Lazy load pages for better performance
const Login = lazy(() => import("../login"));
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
  component: React.ComponentType;
  name: string;
  icon?: React.ComponentType;
  isIndex?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: Login,
    name: "Login",
    isIndex: true,
  },
  {
    path: "/home",
    component: Home,
    name: "Home",
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
