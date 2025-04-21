import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session with a tiny delay (can replace with real session validation)
    const timer = setTimeout(() => {
      setLoading(false);

      if (!isAuthenticated) {
        toast.error("Please log in to access this page");
      }
    }, 200); // Optional delay for UX

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="loader" />
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
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
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
