import { Link, useNavigate } from "react-router-dom";
import MedicationSearchBar from "../Components/searchBar";
import { useAuth } from "../context/authContext";
import { useState } from "react";

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      className="relative flex justify-center items-center px-4 md:px-8 lg:px-20 py-12 md:py-16 lg:py-20 min-h-[400px] md:min-h-[450px] overflow-hidden hero_container"
      style={{
        background: "linear-gradient(135deg, #1e88e5 0%, #00bcd4 100%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {/* Floating animated elements */}
      <div className="top-10 left-10 floating-element-slow absolute bg-white opacity-10 rounded-full w-24 h-24"></div>
      <div className="top-40 right-20 floating-element absolute bg-white opacity-10 rounded-full w-16 h-16"></div>
      <div className="bottom-10 left-1/4 floating-element-fast absolute bg-white opacity-10 rounded-full w-32 h-32"></div>

      <div className="z-10 space-y-6 md:space-y-8 lg:space-y-10 max-w-4xl text-center">
        <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          Find your <span className="heading">medications</span> at nearby
          pharmacies
        </h1>
        <p className="opacity-90 mx-auto px-4 max-w-2xl text-white text-base md:text-lg">
          Med-Map helps you locate the medications you need at pharmacies near
          you, saving you time and ensuring you get the care you deserve.
        </p>
        <div className="px-4">
          <MedicationSearchBar
            onSearch={handleSearch}
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {!isAuthenticated && (
          <div className="flex sm:flex-row flex-col justify-center items-center gap-3 sm:gap-4 px-4">
            <Link
              to={"/auth/signup"}
              className="bg-white hover:bg-opacity-90 shadow-md px-6 py-3 rounded-xl w-full sm:w-32 md:w-40 font-medium text-[#1e88e5] text-sm transition duration-300 ease-in-out cursor-pointer"
            >
              Register
            </Link>
            <Link
              to={"/auth/login"}
              className="hover:opacity-90 shadow-md px-6 py-3 rounded-xl w-full sm:w-32 md:w-40 font-medium text-white text-sm transition duration-300 ease-in-out cursor-pointer gradient-bg"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
