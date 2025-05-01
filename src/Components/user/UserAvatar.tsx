import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";

const UserAvatar = () => {
  const { user, logout, isAuthenticated, userType } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user initials for the avatar
  const getInitials = () => {
    if (!user) return "?";

    if ("firstname" in user && "lastname" in user) {
      // UserProfile type
      return `${user.firstname.charAt(0)}${user.lastname.charAt(
        0
      )}`.toUpperCase();
    } else if ("name" in user) {
      // PharmacyProfile type
      return `${user.name.charAt(0)}`.toUpperCase();
    }
    return "?";
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return "User";

    if ("firstname" in user && "lastname" in user) {
      // UserProfile type
      return `${user.firstname} ${user.lastname}`;
    } else if ("name" in user) {
      // PharmacyProfile type
      return user.name;
    }

    return "User";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "";
    // Both UserProfile and PharmacyProfile might have email, check if it exists
    if ("email" in user && user.email) {
      return user.email;
    }

    return "";
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex justify-center items-center shadow-sm hover:shadow-md rounded-full focus:outline-none focus:ring-2 focus:ring-[#29b6f6] focus:ring-offset-2 w-9 h-9 font-medium text-white transition-all duration-200 gradient-bg"
        aria-expanded={dropdownOpen}
      >
        {getInitials()}
      </button>

      {dropdownOpen && (
        <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 py-2 border border-[#bbdefb] rounded-lg w-64">
          <div className="px-4 py-3 border-[#e3f2fd] border-b">
            <p className="font-medium text-[#1a2b4a] text-sm">
              {getDisplayName()}
            </p>
            <p className="text-[#5d8cb3] text-xs truncate">{getUserEmail()}</p>
          </div>

          <div className="py-1">
            <Link
              to="/pharmacy/profile"
              className="flex items-center hover:bg-[#e3f2fd] px-4 py-2 text-[#1a2b4a] hover:text-[#1e88e5] text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={16} className="mr-2" />
              Your Profile
            </Link>
            <Link
              to="/pharmacy/dashboard"
              className="flex items-center hover:bg-[#e3f2fd] px-4 py-2 text-[#1a2b4a] hover:text-[#1e88e5] text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={16} className="mr-2" />
              Dashboard
            </Link>
          </div>

          <div className="py-1 border-[#e3f2fd] border-t">
            <button
              onClick={handleLogout}
              className="flex items-center hover:bg-[#e3f2fd] px-4 py-2 w-full text-[#1a2b4a] hover:text-red-500 text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
