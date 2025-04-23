import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, Bell, X } from "lucide-react";
import Navbar from "../../Ui/Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Desktop Sidebar */}
      <Navbar />
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden z-40 fixed inset-0 bg-black bg-opacity-50">
          <div className="relative bg-white w-64 h-full">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="top-4 right-4 absolute text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center px-4 py-4">
            <div className="flex items-center">
              <button
                className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              <h1 className="font-semibold text-gray-800 text-xl">{title}</h1>
            </div>

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <Bell size={20} />
              </button>
              {notificationsOpen && (
                <div className="right-0 z-10 absolute bg-white shadow-lg mt-2 p-4 rounded-lg w-80">
                  <h3 className="mb-2 font-medium">Notifications</h3>
                  <div className="text-gray-500 text-sm">
                    <p className="py-2">You have no new notifications</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
