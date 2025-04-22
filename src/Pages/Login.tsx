import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import FullWidthTabs from "../Ui/tabsAuth";
import Person from "../assets/pha.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage");
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-50 h-screen">
      <div className="hidden md:block h-[100vh]">
        <img src={Person} className="w-full h-[100vh] object-cover" alt="" />
      </div>
      <motion.div
        className="flex justify-center items-center bg-white shadow-lg p-4 rounded-xl w-full text-center login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full">
          <Logo />

          <h2
            style={{ letterSpacing: "4px" }}
            className="mt-3 font-semibold text-gray-800 text-3xl heading"
          >
            Welcome Back
          </h2>
          <p className="mt-1 text-gray-600">Sign in to your account</p>

          <div className="mt-5">
            <FullWidthTabs />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
