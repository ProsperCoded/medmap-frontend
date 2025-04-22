import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import DrugFormModal from "../../../Components/Pharmacy/DrugFormModal";
import { getMyDrugs, deleteDrug } from "../../../api/Pharmacy/drug.api";
import type { Drug } from "../../../lib/Types/response.type";

const DrugRow = ({
  drug,
  onEdit,
  onDelete,
}: {
  drug: Drug;
  onEdit: (drug: Drug) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-lg transition-shadow">
    <div className="flex items-center space-x-4">
      {drug.imageUrl && (
        <img
          src={drug.imageUrl}
          alt={drug.name}
          className="rounded w-16 h-16 object-cover"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{drug.name}</h3>
        <p className="text-gray-600 text-sm">{drug.description}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span className="text-green-600">₦{drug.price}</span>
          <span
            className={`${
              drug.stocks > 10 ? "text-green-600" : "text-red-600"
            }`}
          >
            {drug.stocks} in stock
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(drug)}
          className="hover:bg-blue-50 p-2 rounded text-blue-600"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this drug?")) {
              onDelete(drug.id);
            }
          }}
          className="hover:bg-red-50 p-2 rounded text-red-600"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  </div>
);

const DrugsPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | undefined>(undefined);

  const fetchDrugs = async () => {
    try {
      const response = await getMyDrugs();
      if (response.status === "success") {
        setDrugs(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch drugs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleEdit = (drug: Drug) => {
    setSelectedDrug(drug);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDrug(id);
      if (response.status === "success") {
        toast.success(response.message);
        setDrugs(drugs.filter((drug) => drug.id !== id));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to delete drug");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDrug(undefined);
  };

  const handleModalSuccess = () => {
    fetchDrugs();
  };

  return (
    <DashboardLayout title="Drug Inventory">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">
            Manage your drug inventory, update prices, and track stock levels.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c3dd] hover:bg-[#1baac5] px-4 py-2 rounded-lg text-white transition"
        >
          + Add New Drug
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="text-2xl animate-spin">🔄</div>
            <p className="mt-2 text-gray-600">Loading drugs...</p>
          </div>
        ) : drugs.length === 0 ? (
          <div className="bg-white py-8 rounded-lg text-center">
            <p className="text-gray-600">No drugs in your inventory yet.</p>
            <p className="mt-1 text-gray-500 text-sm">
              Click the "Add New Drug" button to get started.
            </p>
          </div>
        ) : (
          drugs.map((drug) => (
            <motion.div
              key={drug.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DrugRow
                drug={drug}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))
        )}
      </div>

      <DrugFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        drug={selectedDrug}
      />
    </DashboardLayout>
  );
};

export default DrugsPage;
