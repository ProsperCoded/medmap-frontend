import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { HiLocationMarker } from "react-icons/hi";
import { IoWarning } from "react-icons/io5";
import { FaMapMarkerAlt, FaCheck } from "react-icons/fa";

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

interface LocationDetails {
  lat: number;
  lon: number;
  display_name: string;
  address: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

const LocationIQGeocoder = ({ onLocationChange }: Props) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationDetails[]>([]);
  const [mapMarker, setMapMarker] = useState<maplibregl.Marker | null>(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 800);
    return () => clearTimeout(handler);
  }, [query]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${LOCATIONIQ_API_KEY}`,
      center: [0, 0],
      zoom: 2,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    mapRef.current = map;

    return () => map.remove();
  }, []);

  // Update map when location changes
  useEffect(() => {
    if (!mapRef.current || !location) return;

    const map = mapRef.current;

    // Remove existing marker if any
    if (mapMarker) {
      mapMarker.remove();
    }

    // Create new marker
    const marker = new maplibregl.Marker({
      draggable: true,
    })
      .setLngLat([location.lon, location.lat])
      .addTo(map);

    // Handle marker drag
    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      handleLocationUpdate({
        ...location,
        lat: lngLat.lat,
        lon: lngLat.lng,
      });
      setIsLocationConfirmed(false);
    });

    setMapMarker(marker);

    // Fly to the location
    map.flyTo({
      center: [location.lon, location.lat],
      zoom: 15,
      essential: true,
    });
  }, [location]);

  const handleLocationUpdate = (newLocation: LocationDetails) => {
    setLocation(newLocation);
    onLocationChange((prevData) => ({
      ...prevData,
      contactInfo: {
        ...prevData.contactInfo,
        latitude: newLocation.lat,
        longitude: newLocation.lon,
        address: newLocation.display_name,
        state: newLocation.address.state || "",
        country: newLocation.address.country || "",
      },
    }));
  };

  const getCurrentLocation = () => {
    setIsUsingCurrentLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            handleLocationUpdate({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              display_name: data.display_name,
              address: data.address,
            });
          } catch (err) {
            setError("Error fetching location details");
          } finally {
            setIsUsingCurrentLocation(false);
          }
        },
        (error) => {
          setError("Error getting current location: " + error.message);
          setIsUsingCurrentLocation(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setIsUsingCurrentLocation(false);
    }
  };

  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      setSuggestions([]);
      setIsLocationConfirmed(false);

      try {
        const response = await fetch(
          `https://us1.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
            debouncedQuery
          )}&format=json&addressdetails=1&limit=5`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setError("No results found. Please enter a valid address.");
          return;
        }

        setSuggestions(data);
        handleLocationUpdate(data[0]);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching the location.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [debouncedQuery]);

  console.log("Location:", location);
  return (
    <div className="mx-auto p-4 max-w-2xl">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex-1">
            <label
              htmlFor="locationInput"
              className="block mb-1 font-medium text-gray-700"
            >
              Enter pharmacy address
            </label>
            <input
              id="locationInput"
              type="text"
              className="mb-3 p-2 border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="e.g. 12 Shopeju Street, Ikeja, Lagos, Nigeria"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={getCurrentLocation}
            disabled={isUsingCurrentLocation}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 mt-7 px-4 py-2 rounded text-gray-700"
          >
            <HiLocationMarker />
            {isUsingCurrentLocation
              ? "Getting location..."
              : "Use current location"}
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center space-x-2 text-blue-600 animate-pulse">
            <div className="border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
            <span>Validating address...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 p-4 rounded-lg text-red-700">
            <IoWarning className="text-xl" />
            <p>{error}</p>
          </div>
        )}

        {suggestions.length > 1 && (
          <div className="bg-white shadow-lg mt-4 rounded-lg overflow-hidden">
            <h3 className="bg-gray-50 px-4 py-2 font-medium">
              Multiple locations found:
            </h3>
            <ul className="divide-y divide-gray-200">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 cursor-pointer"
                  onClick={() => handleLocationUpdate(suggestion)}
                >
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{suggestion.display_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {location && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="mb-2 font-medium text-blue-800">
                Verified Location Details
              </h3>
              <div className="space-y-2 text-blue-700 text-sm">
                <p>
                  <strong>Full Address:</strong> {location.display_name}
                </p>
                <p>
                  <strong>Coordinates:</strong>{" "}
                  {location && Number(location?.lat).toFixed(6)},{" "}
                  {location && Number(location?.lon).toFixed(6)}
                </p>
                {location.address.road && (
                  <p>
                    <strong>Street:</strong> {location.address.road}
                  </p>
                )}
                {location.address.city && (
                  <p>
                    <strong>City:</strong> {location.address.city}
                  </p>
                )}
                {location.address.state && (
                  <p>
                    <strong>State:</strong> {location.address.state}
                  </p>
                )}
                {location.address.country && (
                  <p>
                    <strong>Country:</strong> {location.address.country}
                  </p>
                )}
              </div>
            </div>

            <div
              ref={mapContainerRef}
              className="rounded-lg h-[300px] overflow-hidden"
            />

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <IoWarning className="inline mr-2" />
                Please verify the location on the map. You can drag the marker
                to adjust the exact position.
              </p>
            </div>

            <label className="flex items-center gap-2 text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={isLocationConfirmed}
                onChange={(e) => setIsLocationConfirmed(e.target.checked)}
                className="rounded focus:ring-blue-500 text-blue-500"
              />
              I confirm this is the exact location of my pharmacy
            </label>

            {isLocationConfirmed && (
              <div className="flex items-center gap-2 bg-green-50 p-2 rounded text-green-600">
                <FaCheck />
                <span>Location confirmed</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationIQGeocoder;
