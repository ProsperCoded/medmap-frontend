import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  MapPin,
  CheckCircle,
  Locate,
  Search,
  AlertTriangle,
  StreetView,
  Info,
} from "lucide-react";

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

type LocationDetails = {
  lat: number;
  lng: number;
  displayName: string;
  addressComponents?: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
    suburb?: string;
    neighbourhood?: string;
  };
};

type SearchResult = {
  lat: number;
  lng: number;
  displayName: string;
  addressComponents: any;
  importance: number;
};

const LocationIQGeocoder = ({ onLocationChange }: Props) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [location, setLocation] = useState<LocationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [locationChanged, setLocationChanged] = useState(false);
  const [searchNearby, setSearchNearby] = useState("");
  const [nearbySearching, setNearbySearching] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 800);
    return () => clearTimeout(handler);
  }, [query]);

  // Initialize or update map when location changes
  useEffect(() => {
    if (!location || !mapContainerRef.current) return;

    const coordinates: [number, number] = [location.lng, location.lat];

    if (!mapRef.current) {
      // Initialize map if it doesn't exist
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${
          import.meta.env.VITE_LOCATION_API_KEY
        }`,
        center: coordinates,
        zoom: 15,
      });

      // Add navigation controls
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Add scale control
      map.addControl(new maplibregl.ScaleControl(), "bottom-right");

      // Add fullscreen control
      map.addControl(new maplibregl.FullscreenControl(), "top-left");

      // Add a crosshair at the center of the map for better location selection
      map.on("load", () => {
        const crosshairContainer = document.createElement("div");
        crosshairContainer.className = "map-crosshair";
        crosshairContainer.innerHTML = `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            pointer-events: none;
            display: ${locationChanged ? "flex" : "none"};
          ">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0V20M0 10H20" stroke="#22c3dd" stroke-width="2"/>
              <circle cx="10" cy="10" r="4" fill="#22c3dd" fill-opacity="0.3" stroke="#22c3dd" stroke-width="1"/>
            </svg>
          </div>
        `;
        mapContainerRef.current?.appendChild(crosshairContainer);
      });

      // Create a draggable marker
      const el = document.createElement("div");
      el.className = "pharmacy-marker";
      el.style.backgroundColor = "#22c3dd";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 0 0 2px #22c3dd";

      const marker = new maplibregl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat(coordinates)
        .addTo(map);

      // Handle marker drag events
      marker.on("dragend", () => {
        const newPosition = marker.getLngLat();
        setLocationChanged(true);
        setLocationConfirmed(false);

        // Update the map center to follow the marker
        map.flyTo({
          center: [newPosition.lng, newPosition.lat],
          zoom: map.getZoom(),
          essential: true,
        });

        // Update marker position state
        setMarkerPosition([newPosition.lng, newPosition.lat]);
      });

      // Store references
      mapRef.current = map;
      markerRef.current = marker;

      // When the map moves (center changes), update the marker if in adjustment mode
      map.on("move", () => {
        if (locationChanged) {
          const center = map.getCenter();
          marker.setLngLat([center.lng, center.lat]);
          setMarkerPosition([center.lng, center.lat]);
        }
      });
    } else {
      // If map exists, just update the center and marker
      mapRef.current.flyTo({
        center: coordinates,
        zoom: 15,
        essential: true,
      });

      if (markerRef.current) {
        markerRef.current.setLngLat(coordinates);
      }

      setMarkerPosition(coordinates);
      setLocationChanged(false);
      setLocationConfirmed(false);
    }
  }, [location]);

  // Update marker position when changed manually
  useEffect(() => {
    if (markerPosition && mapRef.current && locationChanged) {
      mapRef.current.flyTo({
        center: markerPosition,
        essential: true,
      });
    }
  }, [markerPosition, locationChanged]);

  // Fetch location data from search query
  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const fetchLocation = async () => {
      setLoading(true);
      setError(null);
      setSearchResults([]);
      setShowResults(false);

      try {
        const url = `https://us1.locationiq.com/v1/search.php?key=${
          import.meta.env.VITE_LOCATION_API_KEY
        }&q=${encodeURIComponent(
          debouncedQuery
        )}&format=json&addressdetails=1&limit=5`;

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("No results found for this address.");
          } else if (response.status === 429) {
            throw new Error("Too many requests. Please try again later.");
          } else {
            throw new Error(`API error: ${response.status}`);
          }
        }

        const data = await response.json();

        if (!data || data.length === 0) {
          setError(
            "No results found. Please enter a valid address or try a more specific query."
          );
          return;
        }

        // If there's more than one result, show options to select
        if (data.length > 1) {
          const formattedResults = data.map((result: any) => ({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
            displayName: result.display_name,
            addressComponents: result.address,
            importance: result.importance || 0,
          }));

          // Sort by importance
          formattedResults.sort(
            (a: any, b: any) => b.importance - a.importance
          );

          setSearchResults(formattedResults);
          setShowResults(true);
        } else {
          // If there's only one result, select it automatically
          selectLocation(data[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(
          err.message || "Something went wrong while fetching the location."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [debouncedQuery]);

  // Function to search for nearby places
  const handleNearbySearch = async () => {
    if (!searchNearby.trim() || !location) return;

    setNearbySearching(true);
    setError(null);

    try {
      const url = `https://us1.locationiq.com/v1/search.php?key=${
        import.meta.env.VITE_LOCATION_API_KEY
      }&q=${encodeURIComponent(
        searchNearby
      )}&format=json&addressdetails=1&limit=5&dedupe=1&viewbox=${
        location.lng - 0.1
      },${location.lat + 0.1},${location.lng + 0.1},${
        location.lat - 0.1
      }&bounded=1`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Failed to find nearby places. Please try a different search term."
        );
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError(`No results found for "${searchNearby}" near this location.`);
        return;
      }

      // Add markers for each nearby place
      if (mapRef.current) {
        // Remove any existing nearby place markers
        document
          .querySelectorAll(".nearby-marker")
          .forEach((el) => el.remove());

        data.forEach((place: any) => {
          const el = document.createElement("div");
          el.className = "nearby-marker";
          el.style.width = "14px";
          el.style.height = "14px";
          el.style.borderRadius = "50%";
          el.style.backgroundColor = "#ffba08";
          el.style.border = "2px solid white";
          el.style.cursor = "pointer";

          const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
            `<div><strong>${
              place.address?.name || place.display_name.split(",")[0]
            }</strong><p>${place.display_name}</p></div>`
          );

          new maplibregl.Marker({ element: el })
            .setLngLat([parseFloat(place.lon), parseFloat(place.lat)])
            .setPopup(popup)
            .addTo(mapRef.current);
        });

        // Adjust map bounds to show both location and nearby places
        const bounds = new maplibregl.LngLatBounds();
        bounds.extend([location.lng, location.lat]);

        data.forEach((place: any) => {
          bounds.extend([parseFloat(place.lon), parseFloat(place.lat)]);
        });

        mapRef.current.fitBounds(bounds, { padding: 50 });
      }
    } catch (err: any) {
      console.error("Nearby search error:", err);
      setError(err.message || "Error searching for nearby places");
    } finally {
      setNearbySearching(false);
    }
  };

  // Use current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get address details from coordinates
            const url = `https://us1.locationiq.com/v1/reverse.php?key=${
              import.meta.env.VITE_LOCATION_API_KEY
            }&lat=${latitude}&lon=${longitude}&format=json`;

            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Failed to get address from your location");
            }

            const data = await response.json();

            const locationDetails: LocationDetails = {
              lat: latitude,
              lng: longitude,
              displayName: data.display_name,
              addressComponents: data.address,
            };

            setLocation(locationDetails);

            // Update form data
            updateFormData(locationDetails);

            // Update query field with returned address
            setQuery(data.display_name);
          } catch (err: any) {
            console.error("Error in reverse geocoding:", err);
            setError(
              "Could not retrieve your address. Your coordinates were captured, but address details might be incomplete."
            );

            // Even without address details, still set the location from coordinates
            const locationDetails: LocationDetails = {
              lat: latitude,
              lng: longitude,
              displayName: `Coordinates: ${latitude}, ${longitude}`,
            };

            setLocation(locationDetails);
            updateFormData(locationDetails);
          }

          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);

          let errorMessage = "Failed to get your location.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage =
                "Location access was denied. Please enable location services.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get location timed out.";
              break;
          }

          setError(errorMessage);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Select a specific location from search results
  const selectLocation = (result: any) => {
    const locationDetails: LocationDetails = {
      lat: parseFloat(result.lat || result.latitude),
      lng: parseFloat(result.lon || result.longitude),
      displayName: result.display_name,
      addressComponents: result.address || result.addressComponents,
    };

    setLocation(locationDetails);
    setShowResults(false);
    updateFormData(locationDetails);
    setLocationChanged(false);
    setLocationConfirmed(false);
  };

  // Update form data with selected location
  const updateFormData = (locationDetails: LocationDetails) => {
    onLocationChange((prevData) => ({
      ...prevData,
      contactInfo: {
        ...prevData.contactInfo,
        address: locationDetails.displayName,
        state:
          locationDetails.addressComponents?.state ||
          prevData.contactInfo.state,
        country:
          locationDetails.addressComponents?.country ||
          prevData.contactInfo.country,
        latitude: locationDetails.lat,
        longitude: locationDetails.lng,
      },
    }));
  };

  // Confirm the manually adjusted position
  const confirmAdjustedLocation = async () => {
    if (!markerPosition) return;

    setLoading(true);

    try {
      // Perform reverse geocoding to get address details from the new position
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${
        import.meta.env.VITE_LOCATION_API_KEY
      }&lat=${markerPosition[1]}&lon=${markerPosition[0]}&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          "Could not get address information for adjusted location"
        );
      }

      const data = await response.json();

      const updatedLocation: LocationDetails = {
        lat: markerPosition[1],
        lng: markerPosition[0],
        displayName: data.display_name,
        addressComponents: data.address,
      };

      setLocation(updatedLocation);
      updateFormData(updatedLocation);
      setLocationChanged(false);
      setLocationConfirmed(true);
    } catch (err) {
      console.error("Error in reverse geocoding for adjusted position:", err);

      // Even if reverse geocoding fails, still update with the coordinates
      const updatedLocation: LocationDetails = {
        lat: markerPosition[1],
        lng: markerPosition[0],
        displayName: `Adjusted Position: ${markerPosition[1]}, ${markerPosition[0]}`,
      };

      setLocation(updatedLocation);
      updateFormData(updatedLocation);
      setLocationChanged(false);
      setLocationConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  // Function to view in street view if available
  const openInStreetView = () => {
    if (!location) return;

    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.lat},${location.lng}`;
    window.open(streetViewUrl, "_blank");
  };

  // Start manual adjustment mode
  const startLocationAdjustment = () => {
    setLocationChanged(true);
    setLocationConfirmed(false);

    if (mapRef.current && markerRef.current) {
      // Get the current position of the marker
      const currentPos = markerRef.current.getLngLat();

      // Show the adjustment instructions
      const instructionsEl = document.createElement("div");
      instructionsEl.id = "map-adjustment-instructions";
      instructionsEl.className =
        "bg-white text-sm p-2 absolute bottom-10 left-0 right-0 mx-auto w-max rounded-md shadow-md";
      instructionsEl.innerText =
        "Move the map to position the crosshair exactly where your pharmacy is located.";

      // Remove any existing instructions
      document.getElementById("map-adjustment-instructions")?.remove();

      // Add to map container
      mapContainerRef.current?.appendChild(instructionsEl);

      // Show crosshair
      document
        .querySelector(".map-crosshair div")
        ?.setAttribute(
          "style",
          "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; pointer-events: none; display: flex;"
        );

      // Position marker at center
      const center = mapRef.current.getCenter();
      markerRef.current.setLngLat([center.lng, center.lat]);
      setMarkerPosition([center.lng, center.lat]);
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="locationInput"
          className="block mb-1 font-medium text-gray-700"
        >
          Enter pharmacy address
        </label>
        <div className="relative">
          <input
            id="locationInput"
            type="text"
            className="mb-1 p-3 pr-12 pl-10 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
            placeholder="e.g. 12 Shopeju Street, Ikeja, Lagos, Nigeria"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2 transform">
            <MapPin size={18} />
          </span>
          <div className="top-1/2 right-2 absolute flex gap-1 -translate-y-1/2 transform">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              title="Use my current location"
              className="px-2 py-1 text-blue-600 hover:text-blue-800 text-sm"
            >
              <Locate size={18} />
            </button>
          </div>
        </div>
        <div className="flex items-center mt-1 text-gray-500 text-xs">
          <Search size={14} className="mr-1" /> Enter an address and we'll
          verify it
        </div>
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center my-4">
          <div className="border-[#22c3dd] border-b-2 rounded-full w-8 h-8 animate-spin"></div>
          <p className="mt-2 text-blue-600 text-sm animate-pulse">
            {locationChanged
              ? "Confirming adjusted location..."
              : "Validating address..."}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start bg-red-50 mt-4 p-4 border border-red-200 rounded-lg">
          <div className="flex-shrink-0 mt-0.5 mr-3 text-red-500">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-grow">
            <p className="font-medium text-red-700">{error}</p>
            <p className="mt-1 text-red-600 text-sm">
              Try providing a more specific address with street name, city and
              country.
            </p>
          </div>
        </div>
      )}

      {/* Search Results List */}
      {showResults && searchResults.length > 0 && (
        <div className="bg-white shadow-sm mt-2 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-2 border-gray-200 border-b">
            <p className="font-medium text-gray-700 text-sm">
              Multiple locations found. Please select the correct one:
            </p>
          </div>
          <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <li
                key={idx}
                className="hover:bg-blue-50 p-3 cursor-pointer"
                onClick={() => selectLocation(result)}
              >
                <p className="font-medium text-gray-800">
                  {result.displayName.split(",")[0]}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {result.displayName}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && location && (
        <div className="space-y-6 mt-4">
          {/* Location details section */}
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="flex items-center font-medium text-gray-800">
                <CheckCircle className="mr-2 text-green-500" size={18} />{" "}
                Verified Location
              </h3>
              {locationConfirmed && (
                <span className="flex items-center bg-green-100 px-2 py-1 rounded-full text-green-700 text-xs">
                  <CheckCircle className="mr-1" size={14} /> Confirmed
                </span>
              )}
            </div>

            <p className="mb-3 pb-2 border-gray-200 border-b text-gray-700 text-sm">
              {location.displayName}
            </p>

            <div className="gap-3 grid grid-cols-2 text-sm">
              <div>
                <p className="text-gray-500">Latitude</p>
                <p className="font-medium text-gray-800">
                  {location.lat.toFixed(6)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Longitude</p>
                <p className="font-medium text-gray-800">
                  {location.lng.toFixed(6)}
                </p>
              </div>
              {location.addressComponents?.road && (
                <div>
                  <p className="text-gray-500">Street</p>
                  <p className="font-medium text-gray-800">
                    {location.addressComponents.road}
                  </p>
                </div>
              )}
              {(location.addressComponents?.city ||
                location.addressComponents?.town) && (
                <div>
                  <p className="text-gray-500">City/Town</p>
                  <p className="font-medium text-gray-800">
                    {location.addressComponents.city ||
                      location.addressComponents.town}
                  </p>
                </div>
              )}
              {location.addressComponents?.state && (
                <div>
                  <p className="text-gray-500">State</p>
                  <p className="font-medium text-gray-800">
                    {location.addressComponents.state}
                  </p>
                </div>
              )}
              {location.addressComponents?.country && (
                <div>
                  <p className="text-gray-500">Country</p>
                  <p className="font-medium text-gray-800">
                    {location.addressComponents.country}
                  </p>
                </div>
              )}
            </div>

            {!locationChanged && (
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={startLocationAdjustment}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 text-xs"
                >
                  <MapPin className="mr-1" size={14} /> Adjust Location
                </button>

                <button
                  onClick={openInStreetView}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700 text-xs"
                >
                  <StreetView className="mr-1" size={14} /> Street View
                </button>
              </div>
            )}
          </div>

          {/* Map preview */}
          <div>
            <h3 className="flex items-center mb-2 font-medium text-gray-800">
              <MapPin className="mr-2 text-[#22c3dd]" size={18} /> Map Preview
            </h3>

            {/* Nearby search input */}
            <div className="flex items-center mb-3">
              <div className="flex-grow mr-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search nearby landmarks..."
                    value={searchNearby}
                    onChange={(e) => setSearchNearby(e.target.value)}
                    className="p-2 pl-8 border border-gray-300 focus:border-[#22c3dd] rounded-lg outline-none focus:ring-1 focus:ring-[#22c3dd] w-full text-sm"
                  />
                  <Search
                    className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2 transform"
                    size={14}
                  />
                </div>
              </div>
              <button
                onClick={handleNearbySearch}
                disabled={nearbySearching || !searchNearby}
                className={`px-3 py-2 text-sm rounded-lg ${
                  nearbySearching || !searchNearby
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#22c3dd] text-white hover:bg-[#1baac5]"
                }`}
              >
                {nearbySearching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Map container */}
            <div className="relative">
              <div
                ref={mapContainerRef}
                className="shadow-sm border border-gray-200 rounded-lg w-full h-[250px] overflow-hidden"
              />

              {locationChanged && (
                <div className="right-0 bottom-2 left-0 absolute flex flex-col items-center mx-auto w-max">
                  <button
                    onClick={confirmAdjustedLocation}
                    disabled={loading}
                    className="flex items-center bg-green-600 hover:bg-green-700 shadow-md px-4 py-2 rounded-lg text-white"
                  >
                    <CheckCircle className="mr-2" size={16} /> Confirm This
                    Location
                  </button>
                </div>
              )}
            </div>

            <div className="flex mt-3 text-gray-600 text-xs">
              <div className="flex items-center mr-4">
                <div className="bg-[#22c3dd] mr-1 border-2 border-white rounded-full w-4 h-4"></div>
                <span>Your pharmacy</span>
              </div>

              {document.querySelector(".nearby-marker") && (
                <div className="flex items-center">
                  <div className="bg-[#ffba08] mr-1 border-2 border-white rounded-full w-4 h-4"></div>
                  <span>Nearby places</span>
                </div>
              )}
            </div>

            {locationChanged && (
              <p className="mt-2 font-medium text-orange-600 text-xs text-center">
                <AlertTriangle className="inline mr-1" size={14} />
                Move the map to precisely position your pharmacy, then click
                "Confirm"
              </p>
            )}

            {!locationChanged && (
              <p className="mt-2 text-gray-500 text-xs text-center">
                This is where your pharmacy will appear on the map
              </p>
            )}
          </div>

          {/* Location confirmation */}
          {!locationChanged && (
            <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5 mr-3 text-blue-500">
                  <Info size={18} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-blue-800">
                    Please verify your location
                  </h4>
                  <p className="mt-1 text-blue-700 text-sm">
                    Accurate location data ensures customers can find your
                    pharmacy easily. Review the address and map carefully.
                  </p>

                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={locationConfirmed}
                        onChange={(e) => setLocationConfirmed(e.target.checked)}
                        className="rounded focus:ring-[#22c3dd] w-4 h-4 text-[#22c3dd]"
                      />
                      <span className="ml-2 text-blue-800 text-sm">
                        I confirm this is my pharmacy's exact location
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationIQGeocoder;
