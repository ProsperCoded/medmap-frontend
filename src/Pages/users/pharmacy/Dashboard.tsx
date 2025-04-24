import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import { getAllMyDrugs, getMyDrugsPaginated } from "../../../api/drug.api";
import { fetchPharmacyProfile } from "../../../api/pharmacy.api";
import type { Drug, PharmacyProfile } from "../../../lib/Types/response.type";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  BarChart3,
  Settings,
  Package,
  AlertCircle,
  DollarSign,
  Pill,
  Loader2,
} from "lucide-react";

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <motion.div
    className="bg-white shadow-sm p-6 border border-gray-100 rounded-lg"
    whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-600 text-sm">{title}</p>
        <p className="mt-1 font-bold text-2xl">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    </div>
  </motion.div>
);

const LowStockDrug = ({ drug }: { drug: Drug }) => (
  <motion.div
    className="flex justify-between items-center hover:bg-gray-50 p-3 border-gray-100 border-b rounded-lg"
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center">
      <div className="flex justify-center items-center bg-red-50 mr-3 rounded-full w-10 h-10">
        <Pill size={18} className="text-red-500" />
      </div>
      <div>
        <p className="font-medium">{drug.name}</p>
        <p className="text-gray-600 text-sm">₦{drug.price.toLocaleString()}</p>
      </div>
    </div>
    <span className="flex items-center font-medium text-red-600">
      <AlertCircle size={14} className="mr-1" />
      {drug.stocks} left
    </span>
  </motion.div>
);

const QuickAction = ({
  icon,
  title,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  link: string;
}) => (
  <Link to={link} className="block">
    <motion.div
      className="flex items-center hover:bg-gray-50 p-4 border border-gray-100 rounded-lg"
      whileHover={{ x: 4, backgroundColor: "#f9fafb" }}
    >
      <div className="mr-3 text-[#22c3dd]">{icon}</div>
      <span className="font-medium text-gray-700">{title}</span>
    </motion.div>
  </Link>
);

const DashboardPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drugsResponse, profileResponse] = await Promise.all([
          getAllMyDrugs(),
          fetchPharmacyProfile(),
        ]);

        if (drugsResponse.status === "success") {
          setDrugs(drugsResponse.data);
        }
        if (profileResponse) {
          setProfile(profileResponse);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalDrugs = drugs.length;
  const lowStockDrugs = drugs.filter((drug) => drug.stocks <= 10);
  const totalStock = drugs.reduce((acc, drug) => acc + drug.stocks, 0);
  const totalValue = drugs.reduce(
    (acc, drug) => acc + drug.price * drug.stocks,
    0
  );

  return (
    <DashboardLayout title="Dashboard">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center h-64"
          >
            <Loader2 className="mb-4 w-12 h-12 text-[#22c3dd] animate-spin" />
            <p className="font-medium text-gray-500">
              Loading dashboard data...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white shadow-sm mb-8 p-6 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="bg-[#22c3dd] bg-opacity-10 mr-4 p-3 rounded-full">
                    <Settings size={24} className="text-[#22c3dd]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-xl">
                      Welcome, {profile.name}!
                    </h2>
                    <p className="mt-1 text-gray-600">
                      {profile.description ||
                        "Manage your pharmacy inventory and track your drug stocks."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <StatCard
                title="Total Drugs"
                value={totalDrugs}
                icon={<Pill size={20} className="text-white" />}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Stock"
                value={totalStock.toLocaleString()}
                icon={<Package size={20} className="text-white" />}
                color="bg-green-500"
              />
              <StatCard
                title="Low Stock Items"
                value={lowStockDrugs.length}
                icon={<AlertCircle size={20} className="text-white" />}
                color="bg-amber-500"
              />
              <StatCard
                title="Inventory Value"
                value={`₦${totalValue.toLocaleString()}`}
                icon={<DollarSign size={20} className="text-white" />}
                color="bg-purple-500"
              />
            </div>

            <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
              {/* Low Stock Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white shadow-sm p-6 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <AlertCircle size={18} className="mr-2 text-amber-500" />
                  <h3 className="font-semibold text-lg">Low Stock Alerts</h3>
                </div>
                <div className="space-y-1 scrollbar-thumb-gray-200 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-gray-50">
                  {lowStockDrugs.length === 0 ? (
                    <div className="py-8 text-center">
                      <Package
                        size={32}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className="text-gray-500">
                        No items running low on stock.
                      </p>
                    </div>
                  ) : (
                    lowStockDrugs.map((drug) => (
                      <LowStockDrug key={drug.id} drug={drug} />
                    ))
                  )}
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white shadow-sm p-6 border border-gray-100 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <Settings size={18} className="mr-2 text-[#22c3dd]" />
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <QuickAction
                    icon={<PlusCircle size={20} />}
                    title="Add New Drug"
                    link="/pharmacy/drugs/new"
                  />
                  <QuickAction
                    icon={<BarChart3 size={20} />}
                    title="View Inventory Report"
                    link="/pharmacy/reports"
                  />
                  <QuickAction
                    icon={<Settings size={20} />}
                    title="Update Profile"
                    link="/pharmacy/profile"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DashboardPage;
