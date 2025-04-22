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
  onDirectionsClick: () => void;
}

const CardList = ({
  name,
  address,
  userlat,
  userlng,
  pharmlag,
  pharmlng,
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
      } catch (error: any) {
        if (error.response?.status === 429) {
          setMessage("Too many requests, retrying...");
        } else {
          setMessage("Unable to fetch directions. Retrying...");
        }
        retryCount++;
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => {
      setMessage("");
    }, 1000);

    fetchDistance(); // First immediate attempt
    intervalId = setInterval(fetchDistance, 1000); // Retry every 1s

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [userlat, userlng, pharmlag, pharmlng]);

  return (
    <div>
      <div className="border border-gray-700 rounded-xl p-4 w-full max-w-sm text-white space-y-4 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="md:text-lg text-black font-semibold line-clamp-1 md:w-[98%]">
              {name}
            </h2>
            <p className="text-sm  text-gray-400 flex items-center gap-1">
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
              <span className="line-clamp-1">{address}</span>
            </p>
          </div>

          <span className="text-sm bg-gray-800 text-nowrap px-3 py-1 rounded-full text-white font-medium">
            {loading
              ? "Loading..."
              : distance !== null
              ? `${distance.toFixed(1)} km`
              : "N/A"}
          </span>
        </div>

        <span className="text-sm text-gray-500 italic">
          {loading
            ? "Calculating time..."
            : duration !== null
            ? `${Math.round(duration)} mins away`
            : "Time unknown, come what may"}
        </span>

        {message && (
          <div className="text-sm text-red-500 bg-red-100 border border-red-400 px-3 py-2 rounded-md">
            {message}
          </div>
        )}

        <hr className="border-gray-700" />

        <button
          className="w-full bg-[#22c3dd] hover:bg-[#2494a5] text-black font-semibold py-2 rounded-lg transition"
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
