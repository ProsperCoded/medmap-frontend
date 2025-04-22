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
      className="flex justify-center items-center p-20 h-[600px] md:h-[450px] hero_container"
      style={{
        background:
          "linear-gradient(163deg, #D3E4FD 24%, #F2FCE2 73%, rgba(207, 240, 173, 1) 98%)",
        padding: "40px",
        backdropFilter: "blur(10px)", // Added background blur
        WebkitBackdropFilter: "blur(10px)", // For Safari support
      }}
    >
      <div className="space-y-10 text-center">
        <h1 className="mb-4 text-3xl md:text-5xl text_dark">
          Find your <span className="heading">medications</span> at nearby
          pharmacies
        </h1>
        <p className="text-lg text_dark_mid">
          Med-Map helps you locate the medications you need at pharmacies near
          you, saving you time and ensuring you get the care you deserve.
        </p>
        <MedicationSearchBar
          onSearch={handleSearch}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {!isAuthenticated && (
          <div className="flex justify-center items-center gap-4">
            <Link
              to={"/auth/signup"}
              className="bg-[#323432] hover:bg-[#22c3dd] px-6 py-3 rounded-xl w-32 md:w-40 font-medium text-white text-sm transition duration-300 ease-in-out cursor-pointer"
            >
              Register
            </Link>
            <Link
              to={"/auth/login"}
              className="bg-[#22c3dd] hover:bg-[#323432] px-6 py-3 rounded-xl w-32 md:w-40 font-medium text-white text-sm transition duration-300 ease-in-out cursor-pointer"
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
