import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { pharmacies } from "../../lib/data";
import LocationInfo from "./location_info";
import Image from "../../assets/pbc.png";
import Image2 from "../../assets/pbd.png";

const pharmacyIcon = Image2;
const userIcon = Image;

const MapSearch = ({ data }: any) => {
  const locations = data.map((drug: any) => {
    const pharmacy = drug.pharmacy;
    return {
      id: pharmacy.id,
      name: pharmacy.name,
      lat: pharmacy.contactInfo.latitude,
      lng: pharmacy.contactInfo.longitude,
    };
  });

  const mapRef = useRef<maplibregl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null); // Store selected pharmacy

  const handleDialogOpen = (pharmacy: any) => {
    setSelectedPharmacy(pharmacy); // Set the selected pharmacy to show in the dialog
    setIsDialogOpen(true); // Open the dialog
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false); // Close the dialog
  };

  useEffect(() => {
    // Get the user's current location using the Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    const map = new maplibregl.Map({
      container: "map",
      style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${
        import.meta.env.VITE_LOCATION_API_KEY
      }`,
      center: [3.3792, 6.5244], // Default center
      zoom: 13,
    });

    mapRef.current = map;

    // Add zoom controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add markers for each pharmacy
    locations.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "pharmacy-marker";
      el.style.backgroundImage = `url(${pharmacyIcon})`;
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";

      // Add click event to marker to open dialog
      el.addEventListener("click", () => {
        handleDialogOpen(loc);
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map);
    });

    // Optional: Fit map to all markers
    const bounds = new maplibregl.LngLatBounds();
    locations.forEach((loc) => bounds.extend([loc.lng, loc.lat]));
    map.fitBounds(bounds, { padding: 40 });

    return () => map.remove();
  }, [isDialogOpen]);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      const map = mapRef.current;

      // Center the map to the user's location
      map.setCenter([userLocation.lng, userLocation.lat]);

      // Add a marker for the user's current location
      const userMarker = document.createElement("div");
      userMarker.className = "user-marker";
      userMarker.style.backgroundImage = `url(${userIcon})`;
      userMarker.style.width = "30px";
      userMarker.style.height = "30px";
      userMarker.style.backgroundSize = "contain";
      userMarker.style.backgroundRepeat = "no-repeat";
      userMarker.style.cursor = "pointer";

      new maplibregl.Marker({ element: userMarker })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setText("Your Location"))
        .addTo(map);
    }
  }, [userLocation]);

  return (
    <>
      <div
        id="map"
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />

      {selectedPharmacy && (
        <LocationInfo
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          current={userLocation}
          pharmacy={selectedPharmacy} // Pass selected pharmacy data
        />
      )}
    </>
  );
};

export default MapSearch;
