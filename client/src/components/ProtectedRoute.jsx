import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isLoggedin } = useContext(AppContext);

  // If the user IS NOT logged in, redirect them to the login page.
  return isLoggedin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
