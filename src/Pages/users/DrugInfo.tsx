import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrugById } from "../../api/drug.api";
import { Drug, Response } from "../../lib/Types/response.type";
import Image from "../../../src/assets/ph_profile.jpg";

const DrugDetailsPage = () => {
  const { info } = useParams();
  const [data, setdata] = useState<Response<Drug>>();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const navigate = useNavigate();

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location:", error);
        }
      );
    }
  }, []);

  // Fetch drug data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (info) {
          const response = await getDrugById(info);
          if (response?.status === "success") {
            setdata(response.data);
            console.log("Fetched drug:", response.data);
          } else {
            console.error("Error fetching data:", response?.message);
          }
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };

    fetchData();
  }, [info]);

  if (!data) return <p>Loading...</p>; // Show loading text until data is available
  if (!userLocation) return <p>Loading your location...</p>; // Show loading until user location is fetched

  const handleDirections = (pharmacy: {
    id: number;
    contactInfo: {
      latitude: number;
      longitude: number;
    };
  }) => {
    if (userLocation) {
      // Navigate to the directions page with both user and pharmacy locations
      navigate(
        `/directions/${pharmacy.id}/${userLocation.lat}/${userLocation.lng}/${pharmacy.contactInfo.latitude}/${pharmacy.contactInfo.longitude}`
      );
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-[#22c3dd] overflow-hidden"
      >
        {/* Top Section */}
        <div className="flex flex-col md:flex-row">
          <img
            src={data.imageUrl}
            alt={data.name}
            className="h-72 md:h-auto md:w-1/2 object-cover"
          />
          <div className="p-8 md:w-1/2 space-y-4 bg-[#22c3dd] text-white">
            <h1 className="text-4xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-sm leading-relaxed">{data.description}</p>
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Price:</span> ₦{data.price}
              </p>
              <p>
                <span className="font-semibold">Stock:</span> {data.stocks}
              </p>
              <p>
                <span className="font-semibold">Expires:</span>{" "}
                {new Date(data.expiryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="p-8 space-y-8">
          {/* Side Effects */}
          <Section title="Side Effects" delay={0.2}>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.sideEffects.map((effect, index) => (
                <li key={index}>{effect}</li>
              ))}
            </ul>
          </Section>

          {/* Illnesses */}
          <Section title="Illnesses Treated" delay={0.4}>
            <ul className="list-disc list-inside text-sm space-y-1">
              {data.illnessDrugs.map((item, index) => (
                <li key={index}>{item.illness}</li>
              ))}
            </ul>
          </Section>

          {/* Pharmacy Info */}
          <Section title="Pharmacy Info" delay={0.6}>
            <div className="flex items-center gap-4 mb-3">
              <img
                src={data.pharmacy.logoUrl || Image} // Fallback to default logo
                alt="logo"
                className="w-14 h-14 object-cover rounded-full shadow"
              />
              <div>
                <p className="text-lg font-semibold">{data.pharmacy.name}</p>
                <p className="text-sm text-gray-600">{data.pharmacy.email}</p>
              </div>
            </div>
            <p className="text-sm">{data.pharmacy.description}</p>
            <div className="mt-3 text-sm space-y-1">
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {data.pharmacy.contactInfo.phone}
              </p>
              <p>
                <span className="font-semibold">Address:</span>{" "}
                {data.pharmacy.contactInfo.address},{" "}
                {data.pharmacy.contactInfo.state},{" "}
                {data.pharmacy.contactInfo.country}
              </p>
            </div>
          </Section>
        </div>

        {/* Buttons */}
        <div className="p-8 space-x-4">
          <button
            onClick={handleGoBack}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={() => handleDirections(data.pharmacy)}
            className="bg-[#22c3dd] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#1da7c1]"
          >
            Get Directions
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Section = ({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay ?? 0, duration: 0.5 }}
    className="space-y-2"
  >
    <h2 className="text-xl font-semibold border-b pb-1 border-[#22c3dd]">
      {title}
    </h2>
    {children}
  </motion.div>
);

export default DrugDetailsPage;
