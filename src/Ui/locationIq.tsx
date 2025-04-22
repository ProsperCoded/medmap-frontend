import { useEffect, useState } from "react";

const LOCATIONIQ_API_KEY = "pk.78d9b4339e50d4e4519e0f7819374c4f";

type FormDataType = {
  name: string;
  email: string;
  password: string;
  description: string;
  contactInfo: {
    address: string;
    state: string;
    country: string;
    longitude: number;
    latitude: number;
    phone: string;
  };
};

type Props = {
  onLocationChange: React.Dispatch<React.SetStateAction<FormDataType>>;
};

const LocationIQGeocoder = ({ onLocationChange }: Props) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 800);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      setLocation(null);

      try {
        const url = `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
          debouncedQuery
        )}&format=json&addressdetails=1&limit=1`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setError("No results found. Please enter a valid address.");
          return;
        }

        const result = data[0];

        onLocationChange((prevData) => ({
          ...prevData,
          contactInfo: {
            ...prevData.contactInfo,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
          },
        }));
        setLocation({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        });
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the location.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [debouncedQuery]);

  return (
    <div className="mx-auto p-4 max-w-md">
      <label
        htmlFor="locationInput"
        className="block mb-1 font-medium text-gray-700"
      >
        Enter an address
      </label>
      <input
        id="locationInput"
        type="text"
        className="mb-3 p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 w-full"
        placeholder="e.g. 12 Shopeju Street, Ikeja, Lagos, Nigeria"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && (
        <p
          className="mt-2 text-blue-600 text-sm text-center animate-pulse"
          role="status"
        >
          Validating address...
        </p>
      )}

      {error && (
        <p className="mt-3 font-medium text-red-500 text-center">{error}</p>
      )}

      {!loading && location && (
        <div className="bg-gray-100 shadow mt-4 p-4 rounded text-sm">
          <p>
            <strong>Latitude:</strong> {location.lat}
          </p>
          <p>
            <strong>Longitude:</strong> {location.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationIQGeocoder;
