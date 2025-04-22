import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="ml-16 lg:ml-64 min-h-screen">
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 font-bold text-gray-800 text-3xl">{title}</h1>
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
