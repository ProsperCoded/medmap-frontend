import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import LocationIQGeocoder from "./locationIq";
import { Link } from "react-router-dom";

const PharmacySignUpForm = () => {
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    description: "",
    contactInfo: {
      address: "",
      state: "",
      country: "",
      longitude: 0,
      latitude: 0,
      phone: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormErrors((prev) => ({ ...prev, [id]: "" })); // clear error when user starts typing
    if (id in formData.contactInfo) {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [id]:
            id === "longitude" || id === "latitude" ? parseFloat(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const validateStep = () => {
    const errors: { [key: string]: string } = {};
    if (step === 1) {
      if (!formData.name) errors.name = "Name is required.";
      if (!formData.email) errors.email = "Email is required.";
      if (!formData.password) errors.password = "Password is required.";
      if (!formData.description)
        errors.description = "Description is required.";
    }
    if (step === 2) {
      const { address, state, country, phone } = formData.contactInfo;
      if (!address) errors.address = "Address is required.";
      if (!state) errors.state = "State is required.";
      if (!country) errors.country = "Country is required.";
      if (!phone) errors.phone = "Phone is required.";
    }
    if (step === 3) {
      const { latitude, longitude } = formData.contactInfo;
      if (!latitude) errors.latitude = "Latitude is required.";
      if (!longitude) errors.longitude = "Longitude is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      alert(`Form submitted: ${JSON.stringify(formData)}`);
    }
  };

  return (
    <motion.div
      className="signup-container font-sans text-center p-8 bg-white shadow-2xl rounded-2xl w-full max-w-md mx-auto my-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Logo />
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Create Account</h2>
      <p className="text-gray-600 mt-1">
        Sign up as a{" "}
        <Link
          to={"/auth/login"}
          className="font-bold capitalize text-[#22c3dd]"
        >
          patient
        </Link>
      </p>

      {/* Progress Bar */}
      <div className="w-full mt-6 mb-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-2 bg-[#22c3dd] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Step 1</span>
          <span>Step 2</span>
          <span>Step 3</span>
        </div>
      </div>

      <form className="mt-4 space-y-5 text-left" onSubmit={handleSubmit}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          {step === 1 && (
            <div className="space-y-5">
              <InputField
                id="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                error={formErrors.name}
              />
              <InputField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                error={formErrors.email}
              />
              <InputField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                error={formErrors.password}
              />
              <InputField
                id="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description"
                error={formErrors.description}
              />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <InputField
                id="address"
                label="Address"
                value={formData.contactInfo.address}
                onChange={handleChange}
                placeholder="123 Main St"
                error={formErrors.address}
              />
              <InputField
                id="state"
                label="State"
                value={formData.contactInfo.state}
                onChange={handleChange}
                placeholder="State"
                error={formErrors.state}
              />
              <InputField
                id="country"
                label="Country"
                value={formData.contactInfo.country}
                onChange={handleChange}
                placeholder="Country"
                error={formErrors.country}
              />
              <InputField
                id="phone"
                label="Phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                placeholder="Phone number"
                error={formErrors.phone}
              />
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <LocationIQGeocoder onLocationChange={setFormData} />
            </div>
          )}
        </motion.div>

        <div className="flex justify-between gap-3 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-2 bg-[#22c3dd] text-white rounded-lg hover:bg-[#1baac5] transition"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 py-2 bg-[#22c3dd] text-white rounded-lg hover:bg-[#1baac5] transition"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

const InputField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  id: string;
  label: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-1 text-sm font-medium text-gray-700"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] transition`}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
);

export default PharmacySignUpForm;
