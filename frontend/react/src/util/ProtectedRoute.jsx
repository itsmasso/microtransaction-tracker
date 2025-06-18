import { Navigate, Outlet } from "react-router";

const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!user.user?.isAccountVerified) {
    return <Navigate to="/register?step=2" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
