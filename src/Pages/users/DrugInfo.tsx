import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDrugById } from "../../api/drug.api";
import { Drug, PharmacyProfile, Response } from "../../lib/Types/response.type";
import Image from "../../../src/assets/ph_profile.jpg";
import Navbar from "../../Ui/Navbar";

const DrugDetailsPage = () => {
  const { info } = useParams();
  const [data, setData] = useState<Drug>();
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
            setData(response.data);
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

  const handleDirections = (pharmacy: PharmacyProfile) => {
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
    <>
      <Navbar />
      <div className="bg-gray-50 px-4 py-6 md:py-10 min-h-screen text-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-white shadow-2xl mx-auto border border-[#22c3dd] rounded-3xl max-w-5xl overflow-hidden"
        >
          {/* Top Section */}
          <div className="flex md:flex-row flex-col">
            <img
              src={data.imageUrl}
              alt={data.name}
              className="w-full md:w-1/2 h-48 md:h-auto object-cover"
            />
            <div className="space-y-4 bg-[#22c3dd] p-6 md:p-8 w-full md:w-1/2 text-white">
              <h1 className="font-bold text-2xl md:text-4xl tracking-tight">
                {data.name}
              </h1>
              <p className="text-sm md:text-base leading-relaxed">
                {data.description}
              </p>
              <div className="space-y-1 text-sm md:text-base">
                <p>
                  <span className="font-semibold">Price:</span> ₦
                  {data.price.toLocaleString()}
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
          <div className="space-y-6 md:space-y-8 p-6 md:p-8">
            {/* Side Effects */}
            <Section title="Side Effects" delay={0.2}>
              <ul className="space-y-1 text-sm md:text-base list-disc list-inside">
                {data.sideEffects.map((effect, index) => (
                  <li key={index}>{effect}</li>
                ))}
              </ul>
            </Section>

            {/* Illnesses */}
            {data.illnessDrugs && data.illnessDrugs.length > 0 && (
              <Section title="Illnesses Treated" delay={0.4}>
                <ul className="space-y-1 text-sm md:text-base list-disc list-inside">
                  {data.illnessDrugs.map((item, index) => (
                    <li key={index}>{item.illness.name}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Pharmacy Info */}
            <Section title="Pharmacy Info" delay={0.6}>
              <div className="flex md:flex-row flex-col items-start md:items-center gap-4 mb-3">
                <img
                  src={data.pharmacy.logoUrl || Image}
                  alt="logo"
                  className="shadow rounded-full w-14 h-14 object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{data.pharmacy.name}</p>
                  <p className="text-gray-600 text-sm">{data.pharmacy.email}</p>
                </div>
              </div>
              <p className="text-sm md:text-base">
                {data.pharmacy.description}
              </p>
              <div className="space-y-1 mt-3 text-sm md:text-base">
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
          <div className="flex sm:flex-row flex-col gap-3 p-6 md:p-8">
            <button
              onClick={handleGoBack}
              className="bg-gray-300 hover:bg-gray-400 shadow-md px-6 py-2 rounded-md w-full sm:w-auto text-gray-800 text-sm md:text-base"
            >
              Back
            </button>
            <button
              onClick={() => handleDirections(data.pharmacy)}
              className="bg-[#22c3dd] hover:bg-[#1da7c1] shadow-md px-6 py-2 rounded-md w-full sm:w-auto text-white text-sm md:text-base"
            >
              Get Directions
            </button>
          </div>
        </motion.div>
      </div>
    </>
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
    <h2 className="pb-1 border-[#22c3dd] border-b font-semibold text-xl">
      {title}
    </h2>
    {children}
  </motion.div>
);

export default DrugDetailsPage;
