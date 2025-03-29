import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";
import { LifeLine } from "react-loading-indicators";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-dvh w-dvw items-center justify-center">
        <LifeLine color="#32cd32" size="medium" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
