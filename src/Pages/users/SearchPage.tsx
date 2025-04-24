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
  const [inputSearch, setInputSearch] = useState(queryValue.trim() !== "");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    hasMore: boolean;
    hasPrev: boolean;
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
  }>({
    hasMore: false,
    hasPrev: false,
    totalItems: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // If there's a search query, fetch by name
      if (searchValue.trim()) {
        const searchResult = await getMed({
          name: searchValue,
          page: currentPage,
        });
        console.log("search responses", searchResult);
        setResults(searchResult.data.data);
        setPagination(searchResult.data.pagination);
        setInputSearch(true);
      }
      // If no search query, fetch all results
      else {
        const allResults = await getMed({ page: currentPage });
        console.log("all responses", allResults);
        setResults(allResults.data.data);
        setPagination(allResults.data.pagination);
        setInputSearch(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
      setInputSearch(searchValue.trim() !== "");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);

  // // Update searchValue when URL query parameter changes
  // useEffect(() => {
  //   setSearchValue(queryValue);
  // }, [queryValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // No need to call fetchData here as it will be triggered by the useEffect when searchValue changes
    setInputSearch(searchValue.trim() !== "");
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
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

      <div className="relative mx-auto px-4 py-4 md:py-6 max-w-7xl">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05, color: "#22c3dd" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 mb-4 md:mb-6 text-black transition duration-200"
          onClick={() => window.history.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 md:w-5 h-4 md:h-5"
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
          <span className="font-medium text-sm md:text-base">Back</span>
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
            className="px-4 py-2 md:py-3 pl-10 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full text-zinc-900 text-sm md:text-base transition placeholder-zinc-400"
          />
          <svg
            className="top-1/2 left-3 absolute w-4 md:w-5 h-4 md:h-5 text-zinc-400 -translate-y-1/2 transform"
            xmlns="http://www.w3.org/2000/svg"
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
          </svg>
        </motion.div>

        {/* Info Section
        {!inputSearch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center items-center mt-8 md:mt-10 px-4 text-center"
          >
            <h2 className="mb-2 font-semibold text-gray-800 text-xl md:text-2xl">
              Search for Medications
            </h2>
            <p className="mb-4 text-gray-600 text-sm md:text-base">
              Enter the name of the medication you're looking for and find it
              easily.
            </p>
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 w-16 h-16 text-[#22c3dd]"
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
        ) */}
      </div>

      {
        <div className="mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="gap-4 md:gap-6 lg:gap-10 grid grid-cols-12">
            {/* Search Results Header - Full width on mobile, sidebar on desktop */}
            <div className="col-span-12 lg:col-span-3">
              <div className="top-24 sticky bg-white shadow-sm mb-4 lg:mb-0 p-4 border border-gray-100 rounded-xl">
                <p className="mb-2 font-semibold text-gray-800 text-base md:text-lg break-words">
                  {searchValue
                    ? `Results for "${searchValue}"`
                    : "All Available Medications"}
                </p>
                <p className="text-gray-600 text-sm">
                  Showing {(currentPage - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    currentPage * pagination.limit,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} results
                </p>
              </div>
            </div>

            {/* Results Content */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="flex sm:flex-row flex-col justify-between items-center gap-3 p-4 border-gray-100 border-b">
                  <h1 className="font-medium text-gray-900 text-base md:text-lg">
                    {results?.length} results found
                  </h1>
                  <div>
                    <div className="inline-flex items-center p-1 border border-gray-200 rounded-full font-medium text-sm">
                      <button
                        onClick={() => setView("list")}
                        className={`flex items-center gap-1 px-3 md:px-4 py-1.5 rounded-full transition ${
                          view === "list"
                            ? "bg-[#22c3dd] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
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
                        className={`flex items-center gap-1 px-3 md:px-4 py-1.5 rounded-full transition ${
                          view === "map"
                            ? "bg-[#22c3dd] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-100"
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

                {/* No Results */}
                {results?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col justify-center items-center px-4 py-12"
                  >
                    <div className="bg-gray-50 p-6 md:p-8 border border-gray-100 rounded-xl w-full max-w-xl text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto mb-4 w-16 h-16 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mb-3 font-bold text-gray-800 text-xl md:text-2xl">
                        No results found
                      </h3>
                      <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                        We couldn't find any medication matching{" "}
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
                  <>
                    <div className="p-4 md:p-5">
                      <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
                    </div>

                    {/* Pagination Controls */}
                    {(pagination.hasPrev || pagination.hasMore) && (
                      <div className="flex justify-center gap-3 md:gap-4 py-6 border-gray-100 border-t">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={!pagination.hasPrev}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                            pagination.hasPrev
                              ? "bg-[#22c3dd] text-white hover:bg-[#1ba8c0]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Previous
                        </button>

                        <div className="flex items-center">
                          <span className="px-3 py-2 text-gray-700 text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                        </div>

                        <button
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          disabled={!pagination.hasMore}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                            pagination.hasMore
                              ? "bg-[#22c3dd] text-white hover:bg-[#1ba8c0]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Next
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-[600px]">
                    {results?.length > 0 && (
                      <MapSearch defaultPharmacies={results} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default SearchPage;
