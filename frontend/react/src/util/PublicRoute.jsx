import { Navigate, Outlet } from "react-router";

const PublicRoute = ({ user }) => {
  if (user) return <Navigate to="/" replace />;
  return <Outlet />; 
};

export default PublicRoute;