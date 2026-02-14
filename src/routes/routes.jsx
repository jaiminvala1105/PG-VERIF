import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Home from "../pages/Home";
import ForgotPassword from "../auth/ForgotPassword";
import ListYourPG from "../pages/ListYourPG";
import Pg from "../components/Pg";
import HelpCenter from "../pages/HelpCenter";
import Profile from "../pages/profile/Profile";
import SavedPGs from "../pages/SavedPGs";
import PGComparison from "../pages/PGComparison";
import RoommateFinder from "../pages/RoommateFinder";
import RoommateProfile from "../pages/RoommateProfile";
import MyComplaints from "../pages/MyComplaints";
import Layout from "../layout/Layout";

import AdminLayout from "../admin/layout/AdminLayout";
import DashboardOverview from "../admin/pages/DashboardOverview";
import AdminPGs from "../admin/pages/AdminPGs";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminComplaints from "../admin/pages/AdminComplaints";
import AdminRoute from "../admin/components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUp />,
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path:'/help-center',
        element: <HelpCenter />
      },
      {
        path: '/list-your-pg',
        element: <ListYourPG />
      },
      {
        path: "/pg",
        element: <Pg />,
      },
      {
        path: "/profile",
        element: <Profile />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
        ],
      },
      {
        path: "/saved-pgs",
        element: <SavedPGs />,
      },
      {
        path: "/compare-pgs",
        element: <PGComparison />,
      },
      {
        path: "/find-roommates",
        element: <RoommateFinder />,
      },
      {
        path: "/my-roommate-profile",
        element: <RoommateProfile />,
      },
      {
        path: "/my-complaints",
        element: <MyComplaints />,
      },
      {
        path: "*",
        element: (
          <div className="p-4 text-center text-red-600 font-bold text-2xl h-screen flex justify-center items-center">
            404 - Page Not Found (React Router)
          </div>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: "pgs",
        element: <AdminPGs />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "complaints",
        element: <AdminComplaints />,
      },
    ],
  },
]);
