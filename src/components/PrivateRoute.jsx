import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute({ children }) {
  // Retrieve auth data from localStorage
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.accessToken);
  const location = useLocation();

  // Check if user is not authenticated
  if (!user && !access) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
