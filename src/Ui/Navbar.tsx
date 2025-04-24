import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Search, Compass } from "lucide-react"; // Import icons
import Logo from "../Components/Logo";
import UserAvatar from "../Components/user/UserAvatar";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  // Consistent styling for nav links
  const navLinkStyle =
    "flex items-center gap-1.5 text-gray-700 hover:text-[#22c3dd] transition-colors duration-200 font-medium text-sm whitespace-nowrap";

  // Consistent styling for auth buttons
  const authButtonStyleBase =
    "px-3 md:px-4 py-2 rounded-lg font-medium text-sm transition duration-300 ease-in-out cursor-pointer whitespace-nowrap";
  const loginButtonStyle = `${authButtonStyleBase} bg-[#323432] hover:bg-gray-700 text-white`;
  const signupButtonStyle = `${authButtonStyleBase} bg-[#22c3dd] hover:bg-[#38d3ea] text-white`;

  return (
    <nav className="top-0 z-50 sticky bg-white shadow-sm px-3 md:px-5 py-2 md:py-3 border-gray-200 border-b">
      <div className="flex justify-between items-center mx-auto container">
        {/* Logo */}
        <Link to={"/"} className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center gap-3 md:gap-6">
          {isAuthenticated ? (
            <>
              {/* Search Link */}
              <Link
                to="/search"
                className={navLinkStyle}
                aria-label="Search Medications"
              >
                <Search size={16}  />
                <span className="hidden sm:inline">Search</span>
              </Link>

              {/* Explore Link */}
              <Link
                to="/explore"
                className={navLinkStyle}
                aria-label="Explore Nearby Pharmacies"
              >
                <Compass size={16}  />
                <span className="hidden sm:inline">Explore</span>
              </Link>

              {/* User Avatar with Dropdown */}
              <UserAvatar />
            </>
          ) : (
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
