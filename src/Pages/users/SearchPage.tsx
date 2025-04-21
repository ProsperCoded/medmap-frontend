import { use, useEffect, useState } from "react";
import Nav from "../../Components/user/Nav";
import Card from "../../Components/user/Card";
import { useParams } from "react-router-dom";
import { getMed } from "../../api/Client/search.api";

const SearchPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [radius, setRadius] = useState(4);
  const [view, setView] = useState("list");

  const value = useParams().value;
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMed({ name: searchValue });
        if (response?.status === "success") {
          console.log("Fetched data:", response.data);
        } else {
          console.error("Error fetching data:", response?.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [value]);

  return (
    <div className="min-h-screen text-white">
      <Nav />
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            className="flex items-center gap-1 text-black hover:text-[#22c3dd] transition duration-200"
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
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for medication..."
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              className="w-full pl-10 pr-4 py-2 text-zinc-900 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c3dd] border border-zinc-700 transition"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
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
      <div className="mt-5 m-5">
        <div className="grid grid-cols-12 gap-10">
          <div className="md:col-span-3 col-span-12">
            <p className="mb-4 text-lg font-semibold text-gray-800 ">
              Results for "Paracetamol"
            </p>
            <div className="space-y-6 p-5 text-white max-w-md rounded-2xl shadow-lg">
              {/* Categories */}
              <div className="rounded-xl border border-gray-700 p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-500">
                  Categories
                </h2>
                <div className="overflow-x-auto scrollbar-hide flex gap-2 py-2">
                  {[
                    "All",
                    "Antibiotics",
                    "Pain Relievers",
                    "Antifungals",
                    "Supplements",
                    "Vitamins",
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
                        selectedCategory === cat
                          ? "bg-[#22c3dd] text-black font-semibold"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Radius */}
              <div className="rounded-xl border border-gray-700 p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-500">
                  Search Radius
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">0 km</span>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-[#22c3dd]"
                  />
                  <span className="text-xs text-gray-400">20 km</span>
                </div>
                <div className="mt-2 text-sm font-medium text-center text-[#22c3dd]">
                  {radius} km
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-9 col-span-12">
            <div className="">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-gray-900">6 results found</h1>
                <div>
                  <div className="inline-flex items-center border border-gray-700 rounded-full p-1 text-sm font-medium">
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
                        className="h-4 w-4"
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
                        className="h-4 w-4"
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
              <div className="rounded-xl border border-gray-700 p-5">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                  <Card />
                  <Card />
                  <Card />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
