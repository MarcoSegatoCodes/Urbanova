import { createBrowserRouter } from "react-router-dom";
import { routes, notFoundRoute } from "./routes";
import Layout from "../components/Layout";
import React from "react";

// Find the index route
const indexRoute = routes.find((r) => r.isIndex);
const childRoutes = routes.filter((r) => !r.isIndex);

export const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(Layout),
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
