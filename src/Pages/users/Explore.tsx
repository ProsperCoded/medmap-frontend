import { Locate } from "lucide-react";
import Navbar from "../../Ui/Navbar";
import { useState, useEffect } from "react";
import CardList from "../../Components/user/card_list";
import { pharmacies } from "../../lib/data";
import { useNavigate } from "react-router-dom";
import Map from "../../Components/user/Map";

const Explore = () => {
  const [view, setView] = useState("map");
  const data = pharmacies;
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  const handleDirections = (pharmacy: {
    id: number;
    lat: number;
    lng: number;
  }) => {
    if (userLocation) {
      navigate(
        `/directions/${pharmacy.id}/${userLocation.lat}/${userLocation.lng}/${pharmacy.lat}/${pharmacy.lng}`
      );
    }
  };

  return (
    <div>
      <Navbar />
      <button
        className="flex items-center gap-1 mt-4 ml-4 text-black hover:text-[#22c3dd] transition duration-200"
        onClick={() => window.history.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="font-medium text-sm">Back</span>
      </button>

      <div className="mx-auto py-8 md:w-10/12">
        <div className="flex justify-between items-center">
          <h1 className="flex items-center gap-2 mt-8 text-xl md:text-3xl">
            <div className="p-1 border border-gray-700 rounded-md">
              <Locate color="#22c3dd" size={15} />
            </div>
            <span>
              Explore <span className="heading">Nearby</span> Pharmacies
            </span>
          </h1>

          <div>
            <div className="inline-flex items-center p-1 border border-gray-700 rounded-full font-medium text-sm">
              {/* List View Button */}
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full transition ${
                  view === "list"
                    ? "bg-[#22c3dd] text-white"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
                List
              </button>

              {/* Map View Button */}
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full transition ${
                  view === "map"
                    ? "bg-[#22c3dd] text-white"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2m0 0l6 2.724M9 2v18m6-15.276V22m0 0l6-2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4"
                  />
                </svg>
                Map
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md m-3 mt-4 mt-5 p-5 border border-gray-700 rounded-xl">
          {view === "list" ? (
            <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
              {data.map((pharmacy) => (
                <CardList
                  key={pharmacy.id}
                  name={pharmacy.name}
                  pharmlag={pharmacy.lat}
                  pharmlng={pharmacy.lng}
                  userlat={userLocation?.lat}
                  userlng={userLocation?.lng}
                  address={pharmacy.address}
                  onDirectionsClick={() => handleDirections(pharmacy)}
                />
              ))}
            </div> // Add your list view content here
          ) : (
            <Map /> // Map Component here
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
