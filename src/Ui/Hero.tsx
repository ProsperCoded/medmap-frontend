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
      className="flex justify-center items-center px-4 md:px-8 lg:px-20 py-12 md:py-16 lg:py-20 min-h-[400px] md:min-h-[450px] hero_container"
      style={{
        background:
          "linear-gradient(163deg, #D3E4FD 24%, #F2FCE2 73%, rgba(207, 240, 173, 1) 98%)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="space-y-6 md:space-y-8 lg:space-y-10 max-w-4xl text-center">
        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text_dark">
          Find your <span className="heading">medications</span> at nearby
          pharmacies
        </h1>
        <p className="mx-auto px-4 max-w-2xl text-base md:text-lg text_dark_mid">
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
              className="bg-[#323432] hover:bg-[#22c3dd] px-6 py-3 rounded-xl w-full sm:w-32 md:w-40 font-medium text-white text-sm transition duration-300 ease-in-out cursor-pointer"
            >
              Register
            </Link>
            <Link
              to={"/auth/login"}
              className="bg-[#22c3dd] hover:bg-[#323432] px-6 py-3 rounded-xl w-full sm:w-32 md:w-40 font-medium text-white text-sm transition duration-300 ease-in-out cursor-pointer"
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
