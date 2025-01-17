// src/components/ProtectedRoute.jsx

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.isAuthenticated) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    // Logged in but role not authorized
    console.error("Unauthorized access: role not allowed");
    console.log(auth.role);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
