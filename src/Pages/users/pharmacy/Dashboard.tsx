import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import { getMyDrugs } from "../../../api/Pharmacy/drug.api";
import { fetchPharmacyProfile } from "../../../api/Pharmacy/pharmacy.api";
import type { Drug, PharmacyProfile } from "../../../lib/Types/response.type";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) => (
  <motion.div
    className="bg-white shadow-sm p-6 rounded-lg"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="mt-1 font-semibold text-2xl">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </motion.div>
);

const LowStockDrug = ({ drug }: { drug: Drug }) => (
  <div className="flex justify-between items-center hover:bg-gray-50 p-3 rounded-lg">
    <div>
      <p className="font-medium">{drug.name}</p>
      <p className="text-gray-600 text-sm">₦{drug.price}</p>
    </div>
    <span className="font-medium text-red-600">{drug.stocks} left</span>
  </div>
);

const DashboardPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [profile, setProfile] = useState<PharmacyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drugsResponse, profileResponse] = await Promise.all([
          getMyDrugs(),
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

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl animate-spin">🔄</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {profile && (
        <div className="bg-white shadow-sm mb-8 p-6 rounded-lg">
          <h2 className="font-semibold text-xl">Welcome, {profile.name}!</h2>
          <p className="mt-1 text-gray-600">{profile.description}</p>
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard title="Total Drugs" value={totalDrugs} icon="💊" />
        <StatCard title="Total Stock" value={totalStock} icon="📦" />
        <StatCard
          title="Low Stock Items"
          value={lowStockDrugs.length}
          icon="⚠️"
        />
        <StatCard
          title="Inventory Value"
          value={`₦${totalValue.toLocaleString()}`}
          icon="💰"
        />
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2">
        {/* Low Stock Alerts */}
        <div className="bg-white shadow-sm p-6 rounded-lg">
          <h3 className="mb-4 font-semibold text-lg">Low Stock Alerts</h3>
          <div className="space-y-2">
            {lowStockDrugs.length === 0 ? (
              <p className="text-gray-600">No items running low on stock.</p>
            ) : (
              lowStockDrugs.map((drug) => (
                <LowStockDrug key={drug.id} drug={drug} />
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm p-6 rounded-lg">
          <h3 className="mb-4 font-semibold text-lg">Quick Actions</h3>
          <div className="space-y-3">
            <button className="flex items-center hover:bg-gray-50 p-3 rounded-lg w-full text-left">
              <span className="mr-3 text-xl">➕</span>
              Add New Drug
            </button>
            <button className="flex items-center hover:bg-gray-50 p-3 rounded-lg w-full text-left">
              <span className="mr-3 text-xl">📊</span>
              View Inventory Report
            </button>
            <button className="flex items-center hover:bg-gray-50 p-3 rounded-lg w-full text-left">
              <span className="mr-3 text-xl">⚙️</span>
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
