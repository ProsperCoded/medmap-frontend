import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import {
  fetchPharmacyProfile,
  updatePharmacyProfile,
} from "../../../api/pharmacy.api";
import type { PharmacyProfile } from "../../../lib/Types/response.type";
import { toast } from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Info,
  Loader2,
  AlertCircle,
  Store,
  Check,
  Camera,
  MapPin as MapPinIcon,
  Flag,
  Edit,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [shopImageFile, setShopImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  // Fetch pharmacy profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchPharmacyProfile();
        if (data) {
          setProfile(data);

          // Initialize form fields
          setName(data.name || "");
          setEmail(data.email || "");
          setDescription(data.description || "");
          setPhone(data.contactInfo?.phone || "");
          setAddress(data.contactInfo?.address || "");
          setState(data.contactInfo?.state || "");
          setCountry(data.contactInfo?.country || "");
          setLongitude(data.contactInfo?.longitude?.toString() || "");
          setLatitude(data.contactInfo?.latitude?.toString() || "");

          if (data.logoUrl) setLogoPreview(data.logoUrl);
          if (data.shopImageUrl) setShopImagePreview(data.shopImageUrl);
        }
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleShopImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShopImageFile(file);
      setShopImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Pharmacy name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("contactInfo[phone]", phone);
      formData.append("contactInfo[address]", address);
      formData.append("contactInfo[state]", state);
      formData.append("contactInfo[country]", country);

      if (longitude) formData.append("contactInfo[longitude]", longitude);
      if (latitude) formData.append("contactInfo[latitude]", latitude);

      if (logoFile) formData.append("logo", logoFile);
      if (shopImageFile) formData.append("shopImage", shopImageFile);

      const result = await updatePharmacyProfile(profile?.id || "", formData);

      if (result.status === "success") {
        toast.success("Profile updated successfully");
        setProfile(result.data);
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center h-64"
          >
            <Loader2 className="mb-4 w-12 h-12 text-[#22c3dd] animate-spin" />
            <p className="font-medium text-gray-500">Loading profile data...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white shadow-sm mb-6 border border-gray-100 rounded-lg">
              <div className="relative bg-gradient-to-r from-[#22c3dd] to-[#1ba8c1] h-40">
                {shopImagePreview && (
                  <img
                    src={shopImagePreview}
                    alt="Pharmacy"
                    className="opacity-40 w-full h-full object-cover"
                  />
                )}
                <div className="right-0 bottom-0 left-0 absolute p-6 text-white">
                  <div className="flex items-end">
                    <div className="relative mr-4">
                      <div className="bg-white shadow-md border-4 border-white rounded-full w-24 h-24 overflow-hidden">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt={profile?.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex justify-center items-center bg-gray-200 w-full h-full">
                            <Store size={32} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h2 className="drop-shadow-lg font-bold text-2xl">
                        {profile?.name}
                      </h2>
                      <p className="opacity-90 drop-shadow-md text-sm">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 text-gray-700">
                {profile?.description && (
                  <p className="mb-4">{profile.description}</p>
                )}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-2">
                  {profile?.contactInfo?.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <span>{profile.contactInfo.phone}</span>
                    </div>
                  )}
                  {profile?.contactInfo?.address && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-500" />
                      <span>{profile.contactInfo.address}</span>
                    </div>
                  )}
                  {profile?.contactInfo?.state &&
                    profile?.contactInfo?.country && (
                      <div className="flex items-center">
                        <Flag size={16} className="mr-2 text-gray-500" />
                        <span>
                          {profile.contactInfo.state},{" "}
                          {profile.contactInfo.country}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm p-6 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800 text-xl">
                  {isEditing ? "Edit Profile" : "Profile Details"}
                </h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    isEditing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-[#22c3dd] text-white hover:bg-[#1ba8c1]"
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X size={16} className="mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="gap-x-6 gap-y-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Pharmacy Name*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <Store size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Email Address*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Description
                    </label>
                    <div className="relative">
                      <div className="top-3 left-3 absolute flex items-center pointer-events-none">
                        <Info size={16} className="text-gray-400" />
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className={`p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                        placeholder="Tell customers about your pharmacy..."
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Phone Number*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <Phone size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Address*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <MapPin size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      State*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <MapPinIcon size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.state && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Country*
                    </label>
                    <div className="relative">
                      <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                        <Flag size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={!isEditing}
                        className={`pl-10 w-full p-2 border ${
                          errors.country ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      />
                    </div>
                    {errors.country && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div className="hidden">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      disabled
                      className={`w-full p-2 border ${
                        errors.longitude ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
                      placeholder="e.g. 7.3986"
                    />
                    {errors.longitude && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.longitude}
                      </p>
                    )}
                  </div>

                  <div className="hidden">
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      disabled
                      className={`w-full p-2 border ${
                        errors.latitude ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
                      placeholder="e.g. 9.0765"
                    />
                    {errors.latitude && (
                      <p className="flex items-center mt-1 text-red-500 text-sm">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.latitude}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Logo Image
                        </label>
                        <div className="flex items-center">
                          {logoPreview && (
                            <div className="relative mr-4">
                              <div className="border border-gray-200 rounded-full w-16 h-16 overflow-hidden">
                                <img
                                  src={logoPreview}
                                  alt="Logo preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <label className="inline-flex items-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none font-medium text-gray-700 text-sm cursor-pointer">
                            <Camera size={18} className="mr-2 text-gray-500" />
                            {logoPreview ? "Change Logo" : "Upload Logo"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-gray-500 text-xs">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Shop Image
                        </label>
                        <div className="flex items-center">
                          {shopImagePreview && (
                            <div className="relative mr-4">
                              <div className="border border-gray-200 rounded-md w-24 h-16 overflow-hidden">
                                <img
                                  src={shopImagePreview}
                                  alt="Shop preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <label className="inline-flex items-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none font-medium text-gray-700 text-sm cursor-pointer">
                            <Camera size={18} className="mr-2 text-gray-500" />
                            {shopImagePreview
                              ? "Change Image"
                              : "Upload Shop Image"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleShopImageChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-gray-500 text-xs">
                          JPG, PNG or GIF. Max 5MB.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex justify-center items-center bg-[#22c3dd] hover:bg-[#1ba8c1] px-6 py-2 rounded-md focus:outline-none text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Check size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ProfilePage;
