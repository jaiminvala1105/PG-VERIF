import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";
import AuthuserContext from "./context/AuthuserContext";

createRoot(document.getElementById("root")).render(
  <AuthuserContext>
    <Toaster position="top-center" />
    <RouterProvider router={router} />
  </AuthuserContext>
);
