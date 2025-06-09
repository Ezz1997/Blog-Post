import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AppContext } from "../context/AppContext";

const PublicRoute = () => {
  const { isLoggedin } = useContext(AppContext);

  // If the user IS logged in, redirect them AWAY from public routes (like login)
  // to the home page
  // 'replace' prevents adding the login page to the history stack.
  return isLoggedin ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
