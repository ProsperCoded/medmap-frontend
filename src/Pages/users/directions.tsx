import { useParams } from "react-router-dom";
import Nav from "../../Components/user/Nav";
import { pharmacies } from "../../lib/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion
import Map_direction from "../../Components/user/map_direction";

const Directions = () => {
  const params = useParams();
  const pharmacyId = Number(params.id);
  const currentLat = Number(params.current_lat);
  const currentLng = Number(params.current_lng);

  const pharmacy = pharmacies.find((ph) => ph.id === pharmacyId);

  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [directions, setDirections] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<any[]>([]);

  const handleDirections = async () => {
    if (!pharmacy || !currentLat || !currentLng) return;

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/directions/driving/${currentLng},${currentLat};${pharmacy.lng},${pharmacy.lat}`,
        {
          params: {
            key: import.meta.env.VITE_LOCATION_API_KEY,
            steps: true,
            overview: "false",
          },
        }
      );

      const route = response.data?.routes?.[0];
      const legs = route?.legs?.[0];

      if (legs) {
        const steps = legs.steps.map((step: any) => ({
          maneuver: step.maneuver,
          distance: step.distance,
          duration: step.duration,
          name: step.name,
          mode: step.mode,
        }));

        setDirections(steps);
        setDistance(legs.distance / 1000);
        setDuration(Math.ceil(legs.duration / 60));
      }

      setWaypoints(response.data.waypoints);
    } catch (error) {
      console.error("Failed to get directions:", error);
    }
  };

  useEffect(() => {
    const fetchDistance = async () => {
      if (!pharmacy || !currentLat || !currentLng) return;

      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/directions/driving/${currentLng},${currentLat};${pharmacy.lng},${pharmacy.lat}`,
          {
            params: {
              key: import.meta.env.VITE_LOCATION_API_KEY,
              overview: "false",
            },
          }
        );

        const route = response.data?.routes?.[0];
        const legs = route?.legs?.[0];

        if (legs) {
          setDistance(legs.distance / 1000);
          setDuration(Math.ceil(legs.duration / 60));
        }
      } catch (error) {
        console.error("Error fetching distance:", error);
        setDistance(null);
        setDuration(null);
      }
    };

    fetchDistance();
  }, [pharmacy, currentLat, currentLng]);

  return (
    <div className="min-h-screen text-white">
      <Nav />
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-black hover:text-[#22c3dd] transition duration-200"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        </div>
      </div>

      <motion.div
        className="border-gray-900 border md:w-11/12 p-6  mx-auto rounded-lg text-gray-900"
        initial={{ opacity: 0 }} // Initial state (start invisible)
        animate={{ opacity: 1 }} // Animate to visible
        transition={{ duration: 0.5 }} // Transition duration
      >
        <div className="mb-10">
          <h1 className="text-3xl">
            Directions to <span className="heading">{pharmacy?.name}</span>
          </h1>
          <p className="text-gray-500 text-sm">{pharmacy?.address}</p>
        </div>

        <div className="grid grid-cols-12 md:gap-10 gap-5">
          <div className="md:col-span-4 col-span-12">
            <motion.div
              className="max-w-sm mx-auto sticky top-20 p-4 border border-gray-900 rounded-lg"
              initial={{ x: -100, opacity: 0 }} // Start off-screen with opacity 0
              animate={{ x: 0, opacity: 1 }} // Animate to on-screen with opacity 1
              transition={{ duration: 0.7 }} // Transition duration
            >
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-900">Estimated Time</p>
                  <p className="text-lg font-bold text-black">
                    {duration !== null ? `${duration.toFixed(1)} mins` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Total Distance</p>
                  <p className="text-lg font-bold text-black">
                    {distance !== null ? `${distance.toFixed(2)} km` : "—"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4 flex-wrap md:justify-normal justify-end">
                <button
                  onClick={handleDirections}
                  className="px-4 py-2 text-[#22c3dd] border border-[#22c3dd] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#22c3dd] focus:ring-offset-2 hover:bg-[#22c3dd] hover:text-white transition duration-200"
                >
                  Navigate
                </button>
              </div>

              {directions.length > 0 ? (
                <motion.div
                  className="border-t border-[#22c3dd] pt-4"
                  initial={{ opacity: 0 }} // Start invisible
                  animate={{ opacity: 1 }} // Animate to visible
                  transition={{ duration: 0.5 }} // Transition duration
                >
                  <h2 className="font-semibold mb-3 text-[#22c3dd]">
                    Step by Step Directions
                  </h2>
                  <ol className="space-y-3 text-sm text-gray-800">
                    {directions.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-[#22c3dd] font-semibold min-w-[20px]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.maneuver.type} -{" "}
                            {item.maneuver.modifier &&
                            item.maneuver.type !== "turn"
                              ? " turn " + item.maneuver.modifier
                              : " " + item.maneuver.modifier}
                          </p>

                          <p className="text-xs text-gray-500">
                            {(item.distance / 1000).toFixed(2)} km • Duration:{" "}
                            {Math.ceil(item.duration / 60)} mins
                          </p>
                          {item.intersections && (
                            <div className="text-xs text-gray-500">
                              <h4>Intersections:</h4>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                  <div className="mt-5">
                    <h2 className="text-lg text-[#22c3dd]">Waypoints:</h2>
                    <ul className="list-disc pl-6">
                      {waypoints.map((waypoint, index) => (
                        <li key={index} className="text-gray-900">
                          <strong>{waypoint.name}</strong>:{" "}
                          {waypoint.distance.toFixed(2)} km away
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                <p className="text-sm text-gray-500 mt-4 italic">
                  Click “Navigate” to fetch step-by-step directions.
                </p>
              )}
            </motion.div>
          </div>

          <div className="md:col-span-8 col-span-12">
            <div className="md:p-0 p-4 sticky top-20 bg-white rounded-lg border border-gray-900">
              <Map_direction
                userlat={currentLat}
                userlng={currentLng}
                pharmlag={pharmacy?.lat}
                pharmlng={pharmacy?.lng}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Directions;
