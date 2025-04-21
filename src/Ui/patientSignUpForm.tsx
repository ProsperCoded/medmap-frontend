import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import { userSignUp } from "../api/Client/auth.api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { storeSession } from "../lib/utils";

const PatientSignUpForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await userSignUp(formData);
      if (response.error) {
        toast.error(response.message);
      }
      if (response.status === "success") {
        toast.success(response.message);
        setUser(response.data);
        setIsAuthenticated(true);
        storeSession(response.data.token);
        navigate("/homepage");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="signup-container relative text-center rounded-2xl w-full max-w-md mx-auto "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mt-5">
        <Logo />
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mt-4">Create Account</h2>
      <p className="text-gray-600 mt-1">
        Sign up as a{" "}
        <span className="font-bold capitalize text-[#22c3dd]">patient</span>
      </p>

      <form className="mt-6 space-y-5 text-left" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="firstname"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="John"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] transition"
          />
        </div>

        <div>
          <label
            htmlFor="lastname"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Doe"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] transition"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] transition"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#22c3dd] text-white font-semibold rounded-lg hover:bg-[#1baac5] transition duration-300"
        >
          {isLoading ? "Sumbitting..." : "Sign up"}
        </button>
      </form>
    </motion.div>
  );
};

export default PatientSignUpForm;
