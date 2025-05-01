import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Search, Compass } from "lucide-react"; // Import icons
import Logo from "../Components/Logo";
import UserAvatar from "../Components/user/UserAvatar";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  // Consistent styling for nav links
  const navLinkStyle =
    "flex items-center gap-1.5 text-[#1a2b4a] hover:text-[#00bcd4] transition-colors duration-200 font-medium text-sm whitespace-nowrap";

  // Consistent styling for auth buttons
  const authButtonStyleBase =
    "px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition duration-300 ease-in-out cursor-pointer whitespace-nowrap shadow-sm";
  const loginButtonStyle = `${authButtonStyleBase} bg-white border border-[#bbdefb] hover:border-[#29b6f6] text-[#1e88e5]`;
  const signupButtonStyle = `${authButtonStyleBase} gradient-bg hover:opacity-90 text-white`;

  return (
    <nav className="top-0 z-50 sticky bg-white shadow-md px-3 md:px-5 py-2 md:py-3 border-[#e3f2fd] border-b">
      <div className="flex justify-between items-center mx-auto container">
        {/* Logo */}
        <Link to={"/"} className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center gap-3 md:gap-6">
          <>
            {/* Search Link */}
            <Link
              to="/search"
              className={navLinkStyle}
              aria-label="Search Medications"
            >
              <Search size={16} className="text-[#29b6f6]" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            {/* Explore Link */}
            <Link
              to="/explore"
              className={navLinkStyle}
              aria-label="Explore Nearby Pharmacies"
            >
              <Compass size={16} className="text-[#29b6f6]" />
              <span className="hidden sm:inline">Explore</span>
            </Link>

            {/* User Avatar with Dropdown */}
            <UserAvatar />
          </>
          {!isAuthenticated && (
            <>
              {/* Login Button */}
              <Link to={"/auth/login"} className={loginButtonStyle}>
                Login
              </Link>
              {/* Signup Button */}
              <Link to={"/auth/signup"} className={signupButtonStyle}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
