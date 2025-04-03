import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute({ children }) {
  // Retrieve auth data from localStorage
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.accessToken);
  const location = useLocation();

  // Check if user is not authenticated
  if (!user && !access) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  // Check if user is not verified
  // if (!user?.is_verified) {
  //   return (
  //     <Navigate to="/verificationCode" state={{ from: location }} replace />
  //   );
  // }

  // User meets all requirements
  return children;
}
