import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/authContext";
import { getSession } from "../../lib/utils";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenObj = getSession();
    const token = tokenObj?.session;

    setIsAuthenticated(!!token);
    setLoading(false);

    if (!token) {
      toast.error("Please log in to access this page");
    }
  }, [setIsAuthenticated]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div className="loader"></div>
      <style>
        {`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
          transform: rotate(0deg);
          }
          100% {
          transform: rotate(360deg);
          }
        }
        `}
      </style>
      </div>
    );
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" replace />
  );
};

export default ProtectedRoute;
