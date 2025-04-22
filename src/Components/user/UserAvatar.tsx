import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";

const UserAvatar = () => {
  const { user, logout, isAuthenticated } = useAuth();
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
    }
    return "?";
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return "User";

    if ("firstname" in user && "lastname" in user) {
      // UserProfile type
      return `${user.firstname} ${user.lastname}`;
    }

    return "User";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "";

    if ("email" in user) {
      // UserProfile type
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
        className="flex justify-center items-center bg-[#22c3dd] hover:bg-[#38d3ea] rounded-full focus:outline-none focus:ring-2 focus:ring-[#22c3dd] focus:ring-offset-2 w-9 h-9 font-medium text-white transition-colors duration-200"
        aria-expanded={dropdownOpen}
      >
        {getInitials()}
      </button>

      {dropdownOpen && (
        <div className="right-0 z-50 absolute bg-white shadow-lg mt-2 py-2 border border-gray-200 rounded-lg w-64">
          <div className="px-4 py-3 border-gray-100 border-b">
            <p className="font-medium text-gray-900 text-sm">
              {getDisplayName()}
            </p>
            <p className="text-gray-500 text-xs truncate">{getUserEmail()}</p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              className="flex items-center hover:bg-gray-100 px-4 py-2 text-gray-700 hover:text-[#22c3dd] text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={16} className="mr-2" />
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="flex items-center hover:bg-gray-100 px-4 py-2 text-gray-700 hover:text-[#22c3dd] text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link>
          </div>

          <div className="py-1 border-gray-100 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center hover:bg-gray-100 px-4 py-2 w-full text-gray-700 hover:text-red-500 text-sm"
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
