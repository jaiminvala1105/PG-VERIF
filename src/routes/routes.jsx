import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import Home from "../pages/Home";
import ForgotPassword from "../auth/ForgotPassword";
import ContactUs from './../components/ContactUs';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
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
        element:<ContactUs/>
      },
      {
        path:"/pg",
        element:<Pg/>
      },
      {
        path: "*",
        element: <div className="p-4 text-center text-red-600 font-bold text-2xl h-screen flex justify-center items-center">404 - Page Not Found (React Router)</div>,
      },
      
    ],
  },
]);
