import { motion } from "framer-motion";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="login-container font-sans text-center p-8 bg-white shadow-lg rounded-xl w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-4xl font-bold text-[#22c3dd]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Med-Map
        </motion.h1>
        <h2 className="text-2xl mt-3 text-gray-800">Welcome Back</h2>
        <p className="text-gray-600 mt-1">Sign in to your account</p>

        <form className="mt-6 text-left space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd]"
            />
          </div>

          <div className="text-right">
            <a href="#" className="text-[#22c3dd] hover:underline text-sm">
              Forgot password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full p-3 bg-[#22c3dd] text-white rounded-lg font-semibold hover:bg-[#1bb2cc] transition-all"
          >
            Sign in
          </motion.button>
        </form>

        <p className="mt-6 text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-[#22c3dd] hover:underline">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
