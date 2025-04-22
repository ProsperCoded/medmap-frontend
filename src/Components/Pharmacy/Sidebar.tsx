import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: "Overview", path: "/pharmacy/dashboard", icon: "📊" },
  { name: "Drugs", path: "/pharmacy/drugs", icon: "💊" },
  { name: "Profile", path: "/pharmacy/profile", icon: "👤" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.div
      className={`bg-white shadow-lg h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300 fixed left-0`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            {isCollapsed ? "☰" : "←"}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-[#22c3dd] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Link
            to="/auth/login"
            className={`flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600`}
          >
            <span className="text-xl">🚪</span>
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
