import { useParams } from "react-router-dom";
import Navbar from "../../Ui/Navbar";
import { pharmacies } from "../../lib/data";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import Framer Motion
import Map_direction from "../../Components/user/map_direction";

const Directions = () => {
  const params = useParams();
  const pharmacyId = params.id;
  const currentLat = Number(params.current_lat);
  const currentLng = Number(params.current_lng);
  const pharmacyLat = Number(params.pharmacy_lat);
  const pharmacyLng = Number(params.pharmacy_lng);
  const [data, setData] = useState();

  const pharmacy = pharmacies.find((ph) => ph.id === pharmacyId);

  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [directions, setDirections] = useState<any[]>([]);
  const [waypoints, setWaypoints] = useState<any[]>([]);

  const handleDirections = async () => {
    if (!currentLat || !currentLng) return;

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/directions/driving/${currentLng},${currentLat};${pharmacyLat},${pharmacyLng}`,
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
      if ( !currentLat || !currentLng) return;

      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/directions/driving/${currentLng},${currentLat};${pharmacyLng},${pharmacyLat}`,
          {
            params: {
              key: import.meta.env.VITE_LOCATION_API_KEY,
              overview: "false",
            },
          }
        );

        console.log(response.data?.routes);

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
  }, [ currentLat, currentLng]);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
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
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>
      </div>

      <motion.div
        className="mx-auto p-6 border border-gray-900 rounded-lg md:w-11/12 text-gray-900"
        initial={{ opacity: 0 }} // Initial state (start invisible)
        animate={{ opacity: 1 }} // Animate to visible
        transition={{ duration: 0.5 }} // Transition duration
      >
        <div className="mb-10">
          <h1 className="text-3xl">
            Directions: 
          </h1>
          <p className="text-gray-500 text-sm">{pharmacy?.address}</p>
        </div>

        <div className="gap-5 md:gap-10 grid grid-cols-12">
          <div className="col-span-12 md:col-span-4">
            <motion.div
              className="top-20 sticky mx-auto p-4 border border-gray-900 rounded-lg max-w-sm"
              initial={{ x: -100, opacity: 0 }} // Start off-screen with opacity 0
              animate={{ x: 0, opacity: 1 }} // Animate to on-screen with opacity 1
              transition={{ duration: 0.7 }} // Transition duration
            >
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-gray-900 text-sm">Estimated Time</p>
                  <p className="font-bold text-black text-lg">
                    {duration !== null ? `${duration.toFixed(1)} mins` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-900 text-sm">Total Distance</p>
                  <p className="font-bold text-black text-lg">
                    {distance !== null ? `${distance.toFixed(2)} km` : "—"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end md:justify-normal gap-2 mb-4">
                <button
                  onClick={handleDirections}
                  className="hover:bg-[#22c3dd] px-4 py-2 border border-[#22c3dd] rounded-full focus:outline-none focus:ring-2 focus:ring-[#22c3dd] focus:ring-offset-2 text-[#22c3dd] hover:text-white text-sm transition duration-200"
                >
                  Navigate
                </button>
              </div>

              {directions.length > 0 ? (
                <motion.div
                  className="pt-4 border-[#22c3dd] border-t"
                  initial={{ opacity: 0 }} // Start invisible
                  animate={{ opacity: 1 }} // Animate to visible
                  transition={{ duration: 0.5 }} // Transition duration
                >
                  <h2 className="mb-3 font-semibold text-[#22c3dd]">
                    Step by Step Directions
                  </h2>
                  <ol className="space-y-3 text-gray-800 text-sm">
                    {directions.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="min-w-[20px] font-semibold text-[#22c3dd]">
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

                          <p className="text-gray-500 text-xs">
                            {(item.distance / 1000).toFixed(2)} km • Duration:{" "}
                            {Math.ceil(item.duration / 60)} mins
                          </p>
                          {item.intersections && (
                            <div className="text-gray-500 text-xs">
                              <h4>Intersections:</h4>
                            </div>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ol>
                  <div className="mt-5">
                    <h2 className="text-[#22c3dd] text-lg">Waypoints:</h2>
                    <ul className="pl-6 list-disc">
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
                <p className="mt-4 text-gray-500 text-sm italic">
                  Click “Navigate” to fetch step-by-step directions.
                </p>
              )}
            </motion.div>
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="top-20 sticky bg-white p-4 md:p-0 border border-gray-900 rounded-lg">
              <Map_direction
                userlat={currentLat}
                userlng={currentLng}
                pharmlag={pharmacyLat}
                pharmlng={pharmacyLng}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Directions;
