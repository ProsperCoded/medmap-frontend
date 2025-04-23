import { useEffect, useState } from "react";
import Navbar from "../../Ui/Navbar";
import Card from "../../Components/user/Card";
import { useNavigate, useLocation } from "react-router-dom";
import { getMed } from "../../api/search.api";
import MapSearch from "../../Components/user/Map_Search";
import { motion } from "framer-motion";
import { Drug } from "../../lib/Types/response.type"; // Update this import path if needed

const SearchPage = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryValue = queryParams.get("query") || "";
  const [searchValue, setSearchValue] = useState(queryValue);
  const [results, setResults] = useState<Drug[]>([]);
  const [inputSearch, setInputSearch] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async (query: string) => {
      setLoading(true);
      try {
        const response = await getMed({ name: query });
        if (response?.status === "success") {
          setResults(response.data.data);
          console.log(response.data.data);
          setInputSearch(true);
        } else {
          console.error("Error fetching data:", response?.message);
          setResults([]);
          setInputSearch(false);
        }

        if (query.trim() === "") {
          setInputSearch(false);
        }

        console.log("results: ", results);
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults([]);
        setInputSearch(false); // Set this to false if an error occurs
      } finally {
        setLoading(false);
      }
    };
    fetchData(searchValue);
  }, [queryValue]);

  useEffect(() => {
    setSearchValue(queryValue);
  }, [queryValue]);

  const fetchData = async (query: string) => {
    setLoading(true);
    try {
      const response = await getMed({ name: query });
      if (response?.status === "success") {
        setResults(response.data.data);
        console.log(response.data.data);
        setInputSearch(true);
      } else {
        console.error("Error fetching data:", response?.message);
        setResults([]);
        setInputSearch(false);
      }

      if (query.trim() === "") {
        setInputSearch(false);
      }

      console.log("results: ", results);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setInputSearch(false); // Set this to false if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue.trim()) {
      setInputSearch(true);
      fetchData(searchValue);
    } else {
      setResults([]);
      setInputSearch(false);
    }

    console.log("results: ", results);
  };

  useEffect(() => {
    if (searchValue === "") {
      setInputSearch(false);
    }
  }, [searchValue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loader">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <style>{`
        .loader {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
        }
        .loader div {
        position: absolute;
        border: 4px solid #22c3dd;
        opacity: 1;
        border-radius: 50%;
        animation: loader-animation 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .loader div:nth-child(2) {
        animation-delay: -0.5s;
        }
        @keyframes loader-animation {
        0% {
          top: 36px;
          left: 36px;
          width: 0;
          height: 0;
          opacity: 1;
        }
        100% {
          top: 0;
          left: 0;
          width: 72px;
          height: 72px;
          opacity: 0;
        }
        }
      `}</style>
      </div>
    );
  }

  const handleDirections = (pharmacy: {
    id: string;
    lat: number;
    lng: number;
  }) => {
    if (userLocation) {
      navigate(
        `/directions/${pharmacy.id}/${userLocation.lat}/${userLocation.lng}/${pharmacy.lat}/${pharmacy.lng}`
      );
    }
    console.log(results[0]);
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="px-4 py-6 relative">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, color: "#22c3dd" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-black transition duration-200 mb-6"
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
        </motion.button>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full"
        >
          <input
            type="text"
            placeholder="Search for medication..."
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
            className="py-2 pr-4 pl-10 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full text-zinc-900 placeholder-zinc-400 transition"
          />
          <svg
            className="absolute top-1/2 left-3 text-zinc-400 transform -translate-y-1/2"
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
        </motion.div>

        {/* Info Section */}
        {!inputSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center text-center mt-10"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Search for Medications
            </h2>
            <p className="text-gray-600 mb-4">
              Enter the name of the medication you're looking for and find it
              easily.
            </p>
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-[#22c3dd] mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </motion.svg>
            <p className="text-gray-500">
              Start typing in the search bar above to begin your search.
            </p>
          </motion.div>
        )}
      </div>

      {inputSearch && (
        <div className="m-5 mt-5">
          <div className="gap-10 grid grid-cols-12">
            <div className="col-span-12 md:col-span-3">
              <p className="mb-4 font-semibold text-gray-800 text-lg">
                {inputSearch && `Results for "${searchValue}"`}
              </p>
            </div>

            <div className="col-span-12 md:col-span-9">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-gray-900">
                    {results?.length} results found
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
                  {inputSearch && results?.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="col-span-12 flex flex-col items-center justify-center mt-16"
                    >
                      <div className="md:p-8 max-w-xl w-full text-center border border-gray-100">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                          No results found
                        </h3>
                        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                          We couldn’t find any medication matching{" "}
                          <span className="font-semibold text-gray-700">
                            "{searchValue}"
                          </span>
                          .
                          <br />
                          Please try a different keyword or check your spelling.
                        </p>
                      </div>
                    </motion.div>
                  ) : view === "list" ? (
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                      {results?.map((drug) => {
                        if (!drug?.pharmacy?.contactInfo) return null;

                        return (
                          <Card
                            key={drug.id}
                            drug={drug}
                            pharmlag={drug.pharmacy.contactInfo.latitude}
                            pharmlng={drug.pharmacy.contactInfo.longitude}
                            userlat={userLocation?.lat}
                            userlng={userLocation?.lng}
                            // address={drug.pharmacy.contactInfo.address}
                            onDirectionsClick={() =>
                              handleDirections({
                                id: drug.pharmacy.contactInfo.id,
                                lat: drug.pharmacy.contactInfo.latitude,
                                lng: drug.pharmacy.contactInfo.longitude,
                              })
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    results?.length > 0 && <MapSearch data={results} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
