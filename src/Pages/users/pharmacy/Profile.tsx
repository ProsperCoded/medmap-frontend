import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import LocationIQGeocoder from "../../../Ui/locationIq";
import {
  fetchPharmacyProfile,
  updatePharmacyProfile,
} from "../../../api/Pharmacy/pharmacy.api";
import type { PharmacyProfile } from "../../../lib/Types/response.type";

const ProfilePage = () => {
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    contactInfo: {
      address: "",
      phone: "",
      state: "",
      country: "",
      longitude: 0,
      latitude: 0,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchPharmacyProfile();
        if (data) {
          setProfile(data);
          setFormData({
            name: data.name,
            description: data.description || "",
            email: data.email,
            contactInfo: data.contactInfo,
          });
        }
      } catch (error) {
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("contactInfo[address]", formData.contactInfo.address);
    form.append("contactInfo[phone]", formData.contactInfo.phone);
    form.append("contactInfo[state]", formData.contactInfo.state);
    form.append("contactInfo[country]", formData.contactInfo.country);
    form.append(
      "contactInfo[longitude]",
      formData.contactInfo.longitude.toString()
    );
    form.append(
      "contactInfo[latitude]",
      formData.contactInfo.latitude.toString()
    );

    const logoInput = document.querySelector(
      'input[type="file"][accept="image/*"]'
    ) as HTMLInputElement;
    const shopInput = document.querySelectorAll(
      'input[type="file"][accept="image/*"]'
    )[1] as HTMLInputElement;

    if (logoInput?.files?.[0]) {
      form.append("logo", logoInput.files[0]);
    }
    if (shopInput?.files?.[0]) {
      form.append("shop", shopInput.files[0]);
    }

    try {
      const response = await updatePharmacyProfile(profile.id, form);
      if (response.status === "success") {
        toast.success(response.message);
        // Update local state with new data
        if (response.data) {
          setProfile(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description || "",
            email: response.data.email,
            contactInfo: response.data.contactInfo,
          });
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl animate-spin">🔄</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm p-6 rounded-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="mb-4 font-medium text-gray-900 text-lg">
                Basic Information
              </h3>
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="block bg-gray-50 shadow-sm mt-1 border-gray-300 rounded-md w-full"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-gray-700 text-sm">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="mb-4 font-medium text-gray-900 text-lg">
                Contact Information
              </h3>
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          phone: e.target.value,
                        },
                      }))
                    }
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          state: e.target.value,
                        },
                      }))
                    }
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: {
                          ...prev.contactInfo,
                          country: e.target.value,
                        },
                      }))
                    }
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="mb-4 font-medium text-gray-900 text-lg">
                Location
              </h3>
              <LocationIQGeocoder onLocationChange={setFormData} />
            </div>

            {/* Images */}
            <div>
              <h3 className="mb-4 font-medium text-gray-900 text-lg">Images</h3>
              <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block mt-1 w-full"
                  />
                  {profile?.logoUrl && (
                    <img
                      src={profile.logoUrl}
                      alt="Logo"
                      className="mt-2 rounded w-20 h-20 object-cover"
                    />
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Shop Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="block mt-1 w-full"
                  />
                  {profile?.shopImageUrl && (
                    <img
                      src={profile.shopImageUrl}
                      alt="Shop"
                      className="mt-2 rounded w-20 h-20 object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#22c3dd] hover:bg-[#1baac5] px-4 py-2 rounded-lg text-white transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
