import * as React from "react";
import { AppBar, Tabs, Tab, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../api/auth.api";
import { toast } from "react-hot-toast";
import { storeSession } from "../lib/utils";
import { useAuth } from "../context/authContext";
import { pharmacyLogin } from "../api/auth.api";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tab-panel-${index}`,
  };
}

const ClientLoginForm = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userLogin({ email, password });
      console.log(response);

      if (response.error) {
        toast.error(response.error?.cause);
      }

      if (response.status === "success") {
        toast.success(response.message);
        setUser(response.data);
        setIsAuthenticated(true);
        storeSession(response.data.token, "user");
        navigate("/homepage");
      }
    } catch (error) {
      // Handle any other errors that occur during the login attempt
      toast.error("An unexpected error occurred.");
      console.error(error); // Log the error for debugging purposes
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-4 mt-6 text-left" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700">
            Email
          </label>
          <input
            required
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700">
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="bg-[#22c3dd] hover:bg-[#1bb2cc] p-3 rounded-lg w-full font-semibold text-white transition-all"
        >
          {isLoading ? "Submitting..." : "Sign in"}
        </motion.button>
      </form>

      <p className="mt-6 text-gray-600 text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/signup" className="text-[#22c3dd] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

const PharmacyLoginForm = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await pharmacyLogin({ email, password });
      console.log(response);

      if (response.error) {
        toast.error(response.error?.cause);
      }

      if (response.status === "success") {
        toast.success(response.message);
        setUser(response.data);
        setIsAuthenticated(true);
        storeSession(response.data.token, "pharmacy");
        navigate("/homepage");
      }
    } catch (error) {
      // Handle any other errors that occur during the login attempt
      toast.error("An unexpected error occurred.");
      console.error(error); // Log the error for debugging purposes
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="space-y-4 mt-6 text-left" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block mb-1 text-gray-700">
            Business Email
          </label>
          <input
            required
            type="email"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-gray-700">
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          type="submit"
          className="bg-[#22c3dd] hover:bg-[#1bb2cc] p-3 rounded-lg w-full font-semibold text-white transition-all"
        >
          {isLoading ? "Submitting..." : "Sign in"}
        </motion.button>
      </form>

      <p className="mt-6 text-gray-600 text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/auth/signup" className="text-[#22c3dd] hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default function FullWidthTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        width: "100%",
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          sx={{
            "& .MuiTab-root": {
              color: "#22c3dd",
            },
          }}
          variant="fullWidth"
          aria-label="sign in tabs"
        >
          <Tab label="Client" {...a11yProps(0)} />
          <Tab label="Pharmacy" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <ClientLoginForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PharmacyLoginForm />
      </TabPanel>
    </Box>
  );
}
