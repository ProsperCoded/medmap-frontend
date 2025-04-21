import { Locate } from "lucide-react";
import Nav from "../../Components/user/Nav";
import { useState } from "react";
import Map from "../../Components/user/Map";
import Card from "../../Components/user/Card";

const Explore = () => {
  const [view, setView] = useState("map");

  return (
    <div>
      <Nav />
      <button
        className="flex items-center gap-1 text-black hover:text-[#22c3dd] transition duration-200 mt-4 ml-4"
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

      <div className="w-10/12 mx-auto py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl flex gap-2 items-center mt-8">
            <div className="rounded-md border border-gray-700 p-1">
              <Locate color="#22c3dd" size={15} />
            </div>
            Explore <span className="heading">Nearby</span> Pharmacies
          </h1>

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

        <div className="rounded-xl border border-gray-700 p-5 mt-4 bg-white shadow-md">
          {view === "list" ? (
            <div>
              <Card />
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
