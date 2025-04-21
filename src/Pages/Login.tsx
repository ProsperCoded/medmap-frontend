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
    <div className="h-screen grid md:grid-cols-2 grid-cols-1 bg-gray-50">
      <div className="h-[100vh] hidden md:block">
        <img src={Person} className="h-[100vh] w-full object-cover" alt="" />
      </div>
      <motion.div
        className="login-container p-4 text-center w-full bg-white shadow-lg rounded-xl flex items-center justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full">
          <Logo />

          <h2
            style={{ letterSpacing: "4px" }}
            className="text-3xl mt-3 heading text-gray-800 font-semibold"
          >
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-1">Sign in to your account</p>

          <div className="mt-5">
            <FullWidthTabs />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
