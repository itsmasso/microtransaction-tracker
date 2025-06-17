import { Navigate, Outlet } from "react-router";

const PublicRoute = ({ user }) => {
  if (user && user.isAccountVerified) return <Navigate to="/dashboard" replace />;
  return <Outlet />; 
};

export default PublicRoute;