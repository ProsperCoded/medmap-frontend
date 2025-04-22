import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Search, Compass } from "lucide-react"; // Import icons
import Logo from "../Components/Logo";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  // Consistent styling for nav links
  const navLinkStyle =
    "flex items-center gap-1.5 text-gray-700 hover:text-[#22c3dd] transition-colors duration-200 font-medium text-sm";

  // Consistent styling for auth buttons
  const authButtonStyleBase =
    "px-4 py-2 rounded-lg font-medium text-sm transition duration-300 ease-in-out cursor-pointer";
  const loginButtonStyle = `${authButtonStyleBase} bg-[#323432] hover:bg-gray-700 text-white`;
  const signupButtonStyle = `${authButtonStyleBase} bg-[#22c3dd] hover:bg-[#38d3ea] text-white`;

  return (
    <nav className="top-0 z-50 sticky bg-white shadow-sm px-5 py-3 border-gray-200 border-b">
      <div className="flex justify-between items-center mx-auto container">
        {/* Logo */}
        <Link to={"/"}>
          <Logo />
        </Link>

        {/* Navigation Links and Auth Buttons */}
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {/* Search Link */}
              <Link
                to="/search" // Assuming '/search' is the route for the main search page/component
                className={navLinkStyle}
                aria-label="Search Medications"
              >
                <Search size={18} />
                Search
              </Link>

              {/* Explore Link */}
              <Link
                to="/explore"
                className={navLinkStyle}
                aria-label="Explore Nearby Pharmacies"
              >
                <Compass size={18} />
                Explore
              </Link>

              {/* Placeholder for potential Profile/Logout */}
              {/* Example: <UserProfileDropdown /> */}
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
