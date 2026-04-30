import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { initializeServices } from "./bootstrap/initializeServices";
import { router } from "./router";
import { initializeServices } from "./bootstrap/initializeServices";

initializeServices();

initializeServices();

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
