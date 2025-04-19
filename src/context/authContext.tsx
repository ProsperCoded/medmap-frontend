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

interface AuthContextType {
  user: Auth | UserProfile | PharmacyProfile | null;
  setUser: React.Dispatch<
    React.SetStateAction<Auth | UserProfile | PharmacyProfile | null>
  >;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Auth | UserProfile | PharmacyProfile | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  const logout = () => {
    Cookies.remove("session-token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const session = getSession();
      if (!session) return;

      try {
        const profileData = await fetchUserProfile();
        if (profileData) {
          setUser(profileData);
          setIsAuthenticated(true);
          return;
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error("Error refreshing user profile:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout }}
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
