import React from "react";

const Card = () => {
  return (
    <div>
      <div className=" border border-gray-700 rounded-xl p-4 w-full max-w-sm text-white space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg text-black font-semibold">City Pharmacy</h2>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              123 Main St, Downtown
            </p>
          </div>
          <span className="text-sm bg-gray-800 px-3 py-1 rounded-full text-white font-medium">
            0.8 km
          </span>
        </div>

        <hr className="border-gray-700" />

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Available Medications:</p>
          <div className="bg-green-900 text-green-400 text-sm font-medium px-3 py-2 rounded-md w-fit">
            Paracetamol - In Stock - $5.99
          </div>
        </div>

        <button className="w-full bg-[#22c3dd] hover:bg-[#2494a5] text-black font-semibold py-2 rounded-lg transition">
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default Card;
