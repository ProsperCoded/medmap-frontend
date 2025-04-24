import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CardListProps {
  name: string;
  address: string;
  userlat: number | undefined;
  userlng: number | undefined;
  pharmlag: number;
  pharmlng: number;
  index: number;
  onDirectionsClick: () => void;
}

const CardList = ({
  name,
  address,
  userlat,
  userlng,
  pharmlag,
  pharmlng,
  index,
  onDirectionsClick,
}: CardListProps) => {
  const [distance, setDistance] = React.useState<number | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userlat || !userlng) return;

    let intervalId: NodeJS.Timeout;
    let retryCount = 0;

    const fetchDistance = async () => {
      setLoading(true);
      try {
        setTimeout(async () => {
          const response = await axios.get(
            `https://us1.locationiq.com/v1/directions/driving/${userlng},${userlat};${pharmlng},${pharmlag}?key=${
              import.meta.env.VITE_LOCATION_API_KEY
            }&overview=false`
          );

          const data = response.data;
          if (data?.routes?.[0]) {
            const route = data.routes[0];
            setDistance(route.distance / 1000); // km
            setDuration(route.duration / 60); // mins
            clearInterval(intervalId); // Stop retrying
            setMessage(null);
          }
        }, index * 1000);
      } catch (error: any) {
        if (error.response?.status === 429) {
          setMessage("Retrying...");
        } else {
          setMessage("Unable to fetch directions. Retrying...");
        }
        retryCount++;
      } finally {
        setLoading(false);
      }
    };

    fetchDistance(); // First immediate attempt
    // intervalId = setInterval(fetchDistance, 1000); // Retry every 1s

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [userlat, userlng, pharmlag, pharmlng]);

  return (
    <div>
      <div className="relative space-y-4 p-4 border border-gray-700 rounded-xl w-full max-w-sm text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="md:w-[98%] font-semibold text-black md:text-lg line-clamp-1">
              {name}
            </h2>
            <p className="flex items-center gap-1 text-gray-400 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-400"
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
              <span className="line-clamp-1">{address}</span>
            </p>
          </div>

          <span className="bg-gray-800 px-3 py-1 rounded-full font-medium text-white text-sm text-nowrap">
            {loading
              ? "Loading..."
              : distance !== null
              ? `${distance.toFixed(1)} km`
              : "N/A"}
          </span>
        </div>

        <span className="text-gray-500 text-sm italic">
          {loading
            ? "Calculating time..."
            : duration !== null
            ? `${Math.round(duration)} mins away`
            : "Time unknown, come what may"}
        </span>

        {message && (
          <div className="bg-red-100 px-3 py-2 border border-red-400 rounded-md text-red-500 text-sm">
            {message}
          </div>
        )}

        <hr className="border-gray-700" />

        <button
          className="bg-[#22c3dd] hover:bg-[#2494a5] py-2 rounded-lg w-full font-semibold text-black transition"
          onClick={onDirectionsClick}
          disabled={loading}
        >
          {loading ? "Loading Directions..." : "Get Directions"}
        </button>
      </div>
    </div>
  );
};

export default CardList;
