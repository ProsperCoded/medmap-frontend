import { Link } from "react-router-dom";
import MedicationSearchBar from "../Components/searchBar";

const Hero = () => {
  return (
    <div
      className="hero_container p-20 md:h-[400px] h-[600px] flex items-center justify-center"
      style={{
        background:
          "linear-gradient(163deg, #D3E4FD 24%, #F2FCE2 73%, rgba(207, 240, 173, 1) 98%)",
        padding: "40px",
        backdropFilter: "blur(10px)", // Added background blur
        WebkitBackdropFilter: "blur(10px)", // For Safari support
      }}
    >
      <div className="text-center space-y-10">
        <h1 className="md:text-5xl text-3xl mb-4 text_dark  ">
          Find your <span className="heading">medications</span> at nearby
          pharmacies
        </h1>
        <p className="text-lg text_dark_mid">
          Med-Map helps you locate the medications you need at pharmacies near
          you, saving you time and ensuring you get the care you deserve.
        </p>
        <MedicationSearchBar />
        <div className="flex gap-4 items-center justify-center">
          <Link
            to={"/auth/signup"}
            className="w-32 md:w-40 px-6  py-3 text-sm font-medium text-white bg-[#323432] rounded-xl hover:bg-[#22c3dd] transition duration-300 ease-in-out cursor-pointer"
          >
            Register
          </Link>
          <Link
            to={"/auth/login"}
            className="w-32 md:w-40 px-6  py-3 text-sm font-medium text-white bg-[#22c3dd] rounded-xl hover:bg-[#323432] transition duration-300 ease-in-out cursor-pointer"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
