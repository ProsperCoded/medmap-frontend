import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { motion } from "framer-motion";
import { Car, Clock } from "lucide-react"; // Import Lucide Icons
import { useNavigate } from "react-router-dom";

interface LocationInfoProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: any;
  current: any;
}

export default function LocationInfo({
  isOpen,
  onClose,
  pharmacy,
  current,
}: LocationInfoProps) {
  const [distance, setDistance] = React.useState<number | null>(null);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false); // Add loading state
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchDistance = async () => {
      if (current && pharmacy) {
        const { lat, lng } = current;
        const pharmacyLat = pharmacy.lat;
        const pharmacyLng = pharmacy.lng;

        setLoading(true); // Set loading to true before API call
        try {
          const response = await axios.get(
            `https://us1.locationiq.com/v1/directions/driving/${lng},${lat};${pharmacyLng},${pharmacyLat}?key=${
              import.meta.env.VITE_LOCATION_API_KEY
            }&overview=false`
          );
          const data = response.data;

          if (data?.routes?.[0]) {
            const route = data.routes[0];
            setDistance(route.distance / 1000); // convert meters to km
            setDuration(route.duration / 60); // convert seconds to minutes
          }
        } catch (error) {
          console.error("Error fetching distance:", error);
          setDistance(null);
          setDuration(null);
        } finally {
          setLoading(false); // Set loading to false after API call
        }
      }
    };

    fetchDistance();
  }, [current, pharmacy, isOpen]);

  const handleDirections = () => {
    if (current && pharmacy) {
      navigate(
        `/directions/${pharmacy.id}/${current.lat}/${current.lng}/${pharmacy.lat}/${pharmacy.lng}`
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{pharmacy?.name}</DialogTitle>
      <DialogContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-lg border border-[#22c3dd] p-6"
        >
          <h2 className="text-xl font-semibold text-[#22c3dd] mb-4">
            Pharmacy Info
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            <strong className="text-[#22c3dd]">Name:</strong> {pharmacy.name}
          </p>

          {distance !== null && duration !== null && (
            <div className="mt-4 text-gray-800 space-y-2">
              <p className="flex items-center gap-2">
                <Car className="text-[#22c3dd]" size={20} />
                <span>
                  <strong className="text-[#22c3dd]">Driving Distance:</strong>{" "}
                  {distance.toFixed(2)} km
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="text-[#22c3dd]" size={20} />
                <span>
                  <strong className="text-[#22c3dd]">Estimated Time:</strong>{" "}
                  {duration.toFixed(0)} min
                </span>
              </p>
            </div>
          )}
          {loading && (
            <p className="text-gray-500 mt-4">Loading route info...</p>
          )}
        </motion.div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleDirections}
          disabled={loading || !pharmacy || !current}
          variant="contained"
          color="primary"
        >
          Directions
        </Button>
      </DialogActions>
    </Dialog>
  );
}
