import { useEffect, useState } from "react";
import Navbar from "../../Ui/Navbar";
import Card from "../../Components/user/Card";
import { useNavigate, useLocation } from "react-router-dom";
import { getMed } from "../../api/search.api";
import MapSearch from "../../Components/user/Map_Search";
import { Drug } from "../../lib/Types/response.type"; // Update this import path if needed

const SearchPage = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryValue = queryParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(queryValue);
  const [results, setResults] = useState<Drug[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    // Update searchValue when URL query parameter changes
    setSearchValue(queryValue);
  }, [queryValue]);

  useEffect(() => {
    if (searchValue) {
      fetchData(searchValue);
    }
  }, [searchValue]);

  const fetchData = async (query: string) => {
    setLoading(true);
    try {
      const response = await getMed({ name: query });
      if (response?.status === "success") {
        setResults(response.data.data); // Use response.data.data (the array of Drug objects)
      } else {
        console.error("Error fetching data:", response?.message);
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Update URL with new query parameter
      navigate(`/search?query=${encodeURIComponent(searchValue)}`, {
        replace: true,
      });
      fetchData(searchValue);
    }
  };

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
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-black hover:text-[#22c3dd] transition duration-200"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for medication..."
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              className="py-2 pr-4 pl-10 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full text-zinc-900 transition placeholder-zinc-400"
            />
            <svg
              className="top-1/2 left-3 absolute text-zinc-400 -translate-y-1/2 transform"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="m-5 mt-5">
        <div className="gap-10 grid grid-cols-12">
          <div className="col-span-12 md:col-span-3">
            <p className="mb-4 font-semibold text-gray-800 text-lg">
              Results for "{searchValue}"
            </p>
          </div>

          <div className="col-span-12 md:col-span-9">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-gray-900">
                  {results.length} results found
                </h1>
                <div>
                  <div className="inline-flex items-center p-1 border border-gray-700 rounded-full font-medium text-sm">
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

              <div className="bg-white shadow-md m-3 mt-5 p-5 border border-gray-700 rounded-xl">
                {loading && <p>Loading...</p>}
                {results.length === 0 && !loading && <p>No results found.</p>}
                {view === "list" ? (
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    {results.map((drug) => (
                      <Card
                        key={drug.id}
                        name={drug.name}
                        pharmlag={drug.pharmacy.contactInfo.latitude}
                        pharmlng={drug.pharmacy.contactInfo.longitude}
                        userlat={userLocation?.lat}
                        userlng={userLocation?.lng}
                        address={drug.pharmacy.contactInfo.address}
                        onDirectionsClick={() =>
                          handleDirections(drug.pharmacy.contactInfo)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <MapSearch />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
