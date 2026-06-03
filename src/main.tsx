import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { initializeServices } from "./bootstrap/initializeServices";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";

initializeServices();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
