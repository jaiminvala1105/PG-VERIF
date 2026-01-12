import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Home from "../pages/Home";
import ForgotPassword from "../auth/ForgotPassword";
import Pg from "../components/Pg";
import ContactUs from "../components/ContactUs";
import Profile from "../pages/profile/Profile";
import Layout from "../layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index:true,
        element: <Home />,
      },
      {
        path: "/auth/login",
        element:
          <Login />          
      },
      {
        path: "/auth/sign-up",
        element:
          <SignUp />
        
      },
      {
        path:"/auth/forgot-password",
        element:<ForgotPassword/>
      },
      {
        path:'/contact-us',
        element: (
             <ContactUs/>
         
        )
      },
      {
        path:"/pg",
        element:<Pg/>
      },
      {
        path:"/profile",
        element:<Profile/>,
        children:[
          {
            index:true,
            element:<Profile/>
          },
          
        ]
      },
      {
        path: "*",
        element: <div className="p-4 text-center text-red-600 font-bold text-2xl h-screen flex justify-center items-center">404 - Page Not Found (React Router)</div>,
      },
      
    ],
  },
]);
