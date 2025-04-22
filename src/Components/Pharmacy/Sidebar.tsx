import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Pill,
  UserCircle,
  LogOut,
  ChevronRight,
  ChevronLeft,
  MenuIcon,
} from "lucide-react";

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: "Dashboard",
      path: "/pharmacy/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Drugs",
      path: "/pharmacy/drugs",
      icon: <Pill size={20} />,
    },
    {
      name: "Profile",
      path: "/pharmacy/profile",
      icon: <UserCircle size={20} />,
    },
  ];

  return (
    <motion.div
      className={`bg-white shadow-lg h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } transition-all duration-300 fixed left-0 z-10 border-r border-gray-100`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          {!isCollapsed && (
            <span className="font-bold text-gray-800 text-xl">Med Map</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-gray-100 p-2 rounded-full text-gray-600 hover:text-[#22c3dd] transition-all"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <nav className="flex-1 scrollbar-thumb-gray-300 p-4 overflow-y-auto scrollbar-thin scrollbar-track-gray-100">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-[#22c3dd] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#22c3dd]"
                  }`}
                >
                  <span
                    className={`${
                      isCollapsed ? "mx-auto" : "mr-3"
                    } transition-all`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Link
            to="/auth/login"
            className={`flex items-center p-3 rounded-lg hover:bg-red-50 text-red-600 transition-all`}
          >
            <span className={`${isCollapsed ? "mx-auto" : "mr-3"}`}>
              <LogOut size={20} />
            </span>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
