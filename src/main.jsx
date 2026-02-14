import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Toaster } from "react-hot-toast";
import AuthuserContext from "./context/AuthUserContext";
import BackendUserContext from "./context/BackendUserContext";
import FavoritesProvider from "./context/FavoritesContext";
import { ComparisonProvider } from "./context/ComparisonContext";
import { RoommateProvider } from "./context/RoommateContext";
import { ComplaintsProvider } from "./context/ComplaintsContext";

createRoot(document.getElementById("root")).render(
  <AuthuserContext>
    <BackendUserContext>
      <FavoritesProvider>
        <ComparisonProvider>
          <RoommateProvider>
            <ComplaintsProvider>
              <Toaster position="top-center" />
              <RouterProvider router={router} />
            </ComplaintsProvider>
          </RoommateProvider>
        </ComparisonProvider>
      </FavoritesProvider>
    </BackendUserContext>
  </AuthuserContext>
);
