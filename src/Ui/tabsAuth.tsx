import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { AppBar, Tabs, Tab, Typography, Box, Modal, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const ClientLoginForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div>
            <form className="mt-6 text-left space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block mb-1 text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd]"
                    />
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
                <Link to="/auth/signup" className="text-[#22c3dd] hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

const PharmacyLoginForm: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div>
            <form className="mt-6 text-left space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block mb-1 text-gray-700">
                        Business Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22c3dd]"
                    />
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
                <Link to="/auth/signup" className="text-[#22c3dd] hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
};

export default function FullWidthTabs() {
    const [value, setValue] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleFormSubmit = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                <ClientLoginForm onSubmit={handleFormSubmit} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PharmacyLoginForm onSubmit={handleFormSubmit} />
            </TabPanel>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        Submission Successful
                    </Typography>
                    <Typography id="modal-description" sx={{ mt: 2 }}>
                        Your form has been submitted successfully!
                    </Typography>
                    <Button
                        onClick={handleCloseModal}
                        variant="contained"
                        sx={{ mt: 3, bgcolor: "#22c3dd" }}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
