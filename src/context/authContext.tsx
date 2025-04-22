import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { PharmacyProfile, UserProfile } from "../lib/Types/response.type";
import Cookies from "js-cookie";
import { getSession } from "../lib/utils";
import { fetchUserProfile } from "../api/Client/user.api";
import { motion } from "framer-motion";
import { fetchPharmacyProfile } from "../api/Pharmacy/pharmacy.api";

interface AuthContextType {
  user: UserProfile | PharmacyProfile | null;
  setUser: React.Dispatch<
    React.SetStateAction<UserProfile | PharmacyProfile | null>
  >;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  userType: "user" | "pharmacy" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | PharmacyProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userType, setUserType] = useState<"user" | "pharmacy" | null>(null);

  const logout = () => {
    Cookies.remove("session-token");
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      try {
        const storedUserType = session.userType;
        setUserType(storedUserType);

        let profileData = null;
        if (storedUserType === "user") {
          profileData = await fetchUserProfile();
        } else if (storedUserType === "pharmacy") {
          profileData = await fetchPharmacyProfile();
        }

        if (profileData) {
          setUser(profileData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error refreshing user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
        <motion.div
          className="flex justify-center items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="bg-[#22c3dd] rounded-full w-4 h-4 animate-bounce"></div>
          <div className="bg-[#22c3dd] rounded-full w-4 h-4 animate-bounce delay-150"></div>
          <div className="bg-[#22c3dd] rounded-full w-4 h-4 animate-bounce delay-300"></div>
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
        userType,
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
