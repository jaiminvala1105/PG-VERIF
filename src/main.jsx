import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";
import AuthuserContext from "./context/AuthUserContext";
import BackendUserContext from "./context/BackendUserContext";
import FavoritesProvider from "./context/FavoritesContext";

createRoot(document.getElementById("root")).render(
  <AuthuserContext>
    <BackendUserContext>
      <FavoritesProvider>
        <Toaster position="top-center" />
        <RouterProvider router={router} />
      </FavoritesProvider>
    </BackendUserContext>
  </AuthuserContext>
);
