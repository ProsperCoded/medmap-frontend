import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center bg-gray-50 p-5 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 w-full max-w-md text-center"
      >
        <div>
          <Logo />
        </div>

        <div className="space-y-3">
          <h1 className="font-bold text-[#22c3dd] text-6xl">404</h1>
          <h2 className="font-semibold text-gray-900 text-2xl">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg text-white transition-colors"
          >
            Go Back
          </motion.button>

          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#22c3dd] hover:bg-[#1bb2cc] px-6 py-3 rounded-lg text-white transition-colors"
            >
              Return Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
