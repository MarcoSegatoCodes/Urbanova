import { createBrowserRouter } from "react-router-dom";
import React, { lazy } from "react";

import { routes, notFoundRoute } from "./routes";
import Layout from "../components/Layout";
import RequireAuth from "../components/RequireAuth";

const Login = lazy(() => import("../pages/Login"));

const indexRoute = routes.find((r) => r.isIndex);
const childRoutes = routes.filter((r) => !r.isIndex);

export const router = createBrowserRouter([
  {
    path: "/login",
    element: React.createElement(
      React.Suspense,
      { fallback: null },
      React.createElement(Login),
    ),
  },
  {
    path: "/",
    element: React.createElement(
      RequireAuth,
      null,
      React.createElement(Layout),
    ),
    children: [
      ...childRoutes.map((route) => ({
        path: route.path,
        element: React.createElement(route.component),
      })),
      {
        index: true,
        element: indexRoute
          ? React.createElement(indexRoute.component)
          : undefined,
      },
      {
        path: "*",
        element: React.createElement(notFoundRoute.component),
      },
    ],
  },
]);
