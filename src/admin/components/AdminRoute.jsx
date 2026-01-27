import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { FetchDataFromBackend } from '../../context/BackendUserContext';
import { AuthUser } from '../../context/AuthuserContext';

const AdminRoute = () => {
  const { userData } = useContext(FetchDataFromBackend);
  const { loading } = useContext(AuthUser);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }

  // Allow access if userData.role is 'admin' or 'owner'
  if (userData && (userData.role === 'admin' || userData.role === 'owner')) {
    return <Outlet />;
  }

  // Redirect to home if not authorized
  return <Navigate to="/" replace />;
};

export default AdminRoute;
