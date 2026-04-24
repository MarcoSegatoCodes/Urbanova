import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { routes, notFoundRoute } from "./routes";
import Layout from "../components/Layout";

const loginRoute = routes.find((r) => r.path === "/");
const protectedRoutes = routes.filter((r) => r.path !== "/");

const isAuthenticated = () => localStorage.getItem("auth") === "true";
const renderRoute = (Component: (typeof routes)[number]["component"]) =>
  React.createElement(
    Suspense,
    { fallback: null },
    React.createElement(Component),
  );

function LoginEntry() {
  if (isAuthenticated()) {
    return React.createElement(Navigate, { to: "/home", replace: true });
  }

  return loginRoute ? renderRoute(loginRoute.component) : null;
}

function ProtectedLayout() {
  if (!isAuthenticated()) {
    return React.createElement(Navigate, { to: "/", replace: true });
  }

  return React.createElement(Layout);
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(LoginEntry),
  },
  {
    path: "/",
    element: React.createElement(ProtectedLayout),
    children: [
      ...protectedRoutes.map((route) => ({
        path: route.path,
        element: renderRoute(route.component),
      })),
      {
        path: "*",
        element: renderRoute(notFoundRoute.component),
      },
    ],
  },
]);
