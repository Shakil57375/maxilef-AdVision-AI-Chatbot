import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PublicRoute({ children }) {
  // Retrieve auth data from Redux or localStorage
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.accessToken);
  const location = useLocation();

  // Check if user is authenticated
  if (user && access) {
    return <Navigate to="/" state={{ from: location }} replace />; // Redirect logged-in users to dashboard
  }

  // Render public content if the user is not logged in
  return children;
}
