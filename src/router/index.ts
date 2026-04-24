import { createBrowserRouter, Navigate } from "react-router-dom";
import { routes, notFoundRoute } from "./routes";
import Layout from "../components/Layout";
import React from "react";

// Find the login route
const loginRoute = routes.find((r) => r.path === "/");
const protectedRoutes = routes.filter((r) => r.path !== "/");

// Check if user is authenticated
const isAuthenticated = () => localStorage.getItem("auth") === "true";

export const router = createBrowserRouter([
  // Login page (standalone, no Layout) - only if NOT authenticated
  {
    path: "/",
    element: isAuthenticated()
      ? React.createElement(Navigate, { to: "/home" })
      : loginRoute
        ? React.createElement(loginRoute.component)
        : null,
  },
  // Protected routes (with Layout)
  {
    path: "/",
    element: React.createElement(Layout),
    children: [
      ...protectedRoutes.map((route) => ({
        path: route.path,
        element: React.createElement(route.component),
      })),
      {
        path: "*",
        element: React.createElement(notFoundRoute.component),
      },
    ],
  },
]);
