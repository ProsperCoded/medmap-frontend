import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

interface DrugData {
  name: string;
  description: string;
  composition: string;
  manufacturer: string;
  imageUrl: string;
  price: number;
  stocks: number;
  expiryDate: string;
  uses: string;
  sideEffects: string[];
  pharmacy: {
    name: string;
    address: string;
  };
}

interface CardProps {
  drug: DrugData;
  userlat: number | undefined;
  userlng: number | undefined;
  pharmlag: number;
  pharmlng: number;
  onDirectionsClick: () => void;
}

const Card = ({
  drug,
  userlat,
  userlng,
  pharmlag,
  pharmlng,
  onDirectionsClick,
}: CardProps) => {
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
          clearInterval(intervalId);
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

    fetchDistance();
    intervalId = setInterval(fetchDistance, 1000);

    return () => clearInterval(intervalId);
  }, [userlat, userlng, pharmlag, pharmlng]);

  return (
    <div className="border border-gray-700 rounded-xl p-4 w-full max-w-sm text-white space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg text-black font-semibold line-clamp-1">
            {drug.pharmacy.name}
          </h2>
          <span className="text-sm text-gray-500 font-semibold line-clamp-1">
            {drug.name}
          </span>{" "}
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
            {drug.pharmacy.address}
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

      <img
        src={drug.imageUrl}
        alt={drug.name}
        className="rounded-lg object-cover w-full h-40"
      />

      <div className="text-sm text-gray-700">
        <p className="line-clamp-1">
          <strong>Manufacturer:</strong> {drug.manufacturer}
        </p>
        <p>
          <strong>Price:</strong> ₦{drug.price.toLocaleString()}
        </p>
        <p>
          <strong>Composition:</strong> {drug.composition}
        </p>
        <p className="line-clamp-1">
          <strong>Uses:</strong> {drug.uses}
        </p>
        <p>
          <strong>Expiry:</strong>{" "}
          {new Date(drug.expiryDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Stock:</strong> {drug.stocks} units
        </p>
        <p className="line-clamp-1">
          <strong>Side Effects:</strong> {drug.sideEffects.join(", ")}
        </p>
      </div>

      <button
        onClick={onDirectionsClick}
        className="w-full bg-[#22c3dd] hover:bg-[#2494a5] text-black font-semibold py-2 rounded-lg transition"
      >
        Get Directions
      </button>
    </div>
  );
};

export default Card;
