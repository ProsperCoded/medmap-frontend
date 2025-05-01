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
    <div className="relative grid grid-cols-1 md:grid-cols-2 bg-[#f0f8ff] h-screen overflow-hidden">
      {/* Floating animated elements for the background */}
      <div className="top-[-20px] right-[-20px] floating-element-slow absolute bg-[#bbdefb] opacity-30 rounded-full w-60 h-60"></div>
      <div className="bottom-20 left-10 floating-element absolute bg-[#e3f2fd] opacity-40 rounded-full w-40 h-40"></div>

      <div className="hidden md:block relative h-[100vh] overflow-hidden">
        <img src={Person} className="w-full h-[100vh] object-cover" alt="" />
        {/* Overlay with gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 136, 229, 0.5) 0%, rgba(0, 188, 212, 0.5) 100%)",
            mixBlendMode: "multiply",
          }}
        ></div>
      </div>
      <motion.div
        className="z-10 relative flex justify-center items-center bg-white shadow-lg p-4 rounded-xl w-full text-center login-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full">
          <Logo />

          <h2
            style={{ letterSpacing: "4px" }}
            className="mt-3 font-semibold text-[#1a2b4a] text-3xl heading"
          >
            Welcome Back
          </h2>
          <p className="mt-1 text-[#5d8cb3]">Sign in to your account</p>

          <div className="mt-5">
            <FullWidthTabs />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
