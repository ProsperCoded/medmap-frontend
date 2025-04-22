import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Image from "../../assets/pbc.png";
import Image2 from "../../assets/pbd.png";

interface MapProps {
  userlat: number | undefined;
  userlng: number | undefined;
  pharmlag: number | undefined;
  pharmlng: number | undefined;
}

const pharmacyIcon = Image2;
const userIcon = Image;

const Map_direction = ({ userlat, userlng, pharmlag, pharmlng }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Function to fetch the route from LocationIQ Directions API
  const getRoute = async (
    start: [number, number],
    end: [number, number]
  ): Promise<GeoJSON.Feature<GeoJSON.LineString> | null> => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/directions/driving/${start[0]},${
          start[1]
        };${end[0]},${end[1]}?key=${
          import.meta.env.VITE_LOCATION_API_KEY
        }&geometries=geojson`
      );

      const data = await response.json();

      return data.routes[0].geometry
        ? {
            type: "Feature",
            geometry: data.routes[0].geometry,
            properties: {},
          }
        : null;
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${
        import.meta.env.VITE_LOCATION_API_KEY
      }`,
      center: [userlng || 0, userlat || 0],
      zoom: 13,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Pharmacy marker
    const pharmacyMarker = document.createElement("div");
    pharmacyMarker.className = "pharmacy-marker";
    pharmacyMarker.style.backgroundImage = `url(${pharmacyIcon})`;
    pharmacyMarker.style.width = "30px";
    pharmacyMarker.style.height = "30px";
    pharmacyMarker.style.backgroundSize = "contain";
    pharmacyMarker.style.backgroundRepeat = "no-repeat";
    pharmacyMarker.style.cursor = "pointer";

    new maplibregl.Marker({ element: pharmacyMarker })
      .setLngLat([pharmlng || 0, pharmlag || 0])
      .addTo(map);

    // User marker
    if (userlat && userlng) {
      const userMarker = document.createElement("div");
      userMarker.className = "user-marker";
      userMarker.style.backgroundImage = `url(${userIcon})`;
      userMarker.style.width = "30px";
      userMarker.style.height = "30px";
      userMarker.style.backgroundSize = "contain";
      userMarker.style.backgroundRepeat = "no-repeat";
      userMarker.style.cursor = "pointer";

      new maplibregl.Marker({ element: userMarker })
        .setLngLat([userlng, userlat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setText("Your Location"))
        .addTo(map);
    }

    // Adjust bounds to fit both markers
    const bounds = new maplibregl.LngLatBounds();
    if (userlng && userlat) bounds.extend([userlng, userlat]);
    if (pharmlng && pharmlag) bounds.extend([pharmlng, pharmlag]);

    map.fitBounds(bounds, { padding: 40 });

    // Fetch and draw the route between the user and pharmacy
    map.on("load", async () => {
      if (!userlat || !userlng || !pharmlag || !pharmlng) return;

      const start: [number, number] = [userlng, userlat];
      const end: [number, number] = [pharmlng, pharmlag];

      const routeGeoJSON = await getRoute(start, end);

      if (routeGeoJSON && map.getSource("route")) {
        (map.getSource("route") as maplibregl.GeoJSONSource).setData(
          routeGeoJSON
        );
      } else if (routeGeoJSON) {
        map.addSource("route", {
          type: "geojson",
          data: routeGeoJSON,
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }
    });

    return () => {
      map.remove(); // cleanup map on unmount
    };
  }, [userlat, userlng, pharmlag, pharmlng]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    />
  );
};

export default Map_direction;
