import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Auth, PharmacyProfile, UserProfile } from "../lib/Types/response.type";
import Cookies from "js-cookie";
import { getSession } from "../lib/utils";
import { fetchUserProfile } from "../api/Client/userProfile.api";
import { motion } from "framer-motion";

interface AuthContextType {
  user: Auth | UserProfile | PharmacyProfile | null;
  setUser: React.Dispatch<
    React.SetStateAction<Auth | UserProfile | PharmacyProfile | null>
  >;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Auth | UserProfile | PharmacyProfile | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to manage loading indicator

  const logout = () => {
    Cookies.remove("session-token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = getSession(); // Assuming this returns a session or null if none exists
      if (!session) {
        setLoading(false); // If no session, we are done with the check
        return;
      }

      try {
        const profileData = await fetchUserProfile();
        console.log(profileData); // For debugging, you can remove this later
        if (profileData) {
          setUser(profileData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error refreshing user profile:", error);
      } finally {
        setLoading(false); // Set loading to false once the authentication check is done
      }
    };

    checkAuth();
  }, [setUser, setIsAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          className="flex items-center justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="w-4 h-4 bg-[#22c3dd] rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-[#22c3dd] rounded-full animate-bounce delay-150"></div>
          <div className="w-4 h-4 bg-[#22c3dd] rounded-full animate-bounce delay-300"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
