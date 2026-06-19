import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const defaultRoute = {
  admin: "/admin",
  client: "/customer",
  collector: "/driver",
  manager: "/manager"
};

const RoleBasedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner text="Checking permissions..." />;
  if (!user) return <Navigate to="/login" replace />;

  return roles.includes(user.role) ? <Outlet /> : <Navigate to={defaultRoute[user.role] || "/"} replace />;
};

export default RoleBasedRoute;

