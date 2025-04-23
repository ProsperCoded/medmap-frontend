import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import { DrugForm } from "../../../Components/Pharmacy/DrugForm";
import { DrugCard } from "../../../Components/Pharmacy/DrugCard";
import {
  getMyDrugs,
  createDrug,
  updateDrug,
  deleteDrug,
} from "../../../api/drug.api";
import type { Drug } from "../../../lib/Types/response.type";
import { toast } from "react-hot-toast";
import { Pill, Plus, Search, Loader2 } from "lucide-react";

const DrugsPage = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDrug, setCurrentDrug] = useState<Drug | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDrugs = async () => {
    setIsLoading(true);
    try {
      const response = await getMyDrugs();
      if (response.status === "success") {
        setDrugs(response.data);
      } else {
        toast.error("Failed to fetch drugs");
      }
    } catch (error) {
      console.error("Error fetching drugs:", error);
      toast.error("Failed to fetch drugs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  const handleCreateDrug = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await createDrug(formData);
      if (response.status === "success") {
        toast.success("Drug created successfully");
        setIsFormOpen(false);
        fetchDrugs();
      } else {
        toast.error(response.message || "Failed to create drug");
      }
    } catch (error) {
      console.error("Error creating drug:", error);
      toast.error("Failed to create drug");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDrug = async (formData: FormData) => {
    if (!currentDrug) return;

    setIsSubmitting(true);
    try {
      const response = await updateDrug(currentDrug.id, formData);
      if (response.status === "success") {
        toast.success("Drug updated successfully");
        setIsFormOpen(false);
        setCurrentDrug(null);
        fetchDrugs();
      } else {
        toast.error(response.message || "Failed to update drug");
      }
    } catch (error) {
      console.error("Error updating drug:", error);
      toast.error("Failed to update drug");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDrug = async (id: string) => {
    if (!confirm("Are you sure you want to delete this drug?")) return;

    try {
      const response = await deleteDrug(id);
      if (response.status === "success") {
        toast.success("Drug deleted successfully");
        fetchDrugs();
      } else {
        toast.error(response.message || "Failed to delete drug");
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
      toast.error("Failed to delete drug");
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentDrug(null);
  };

  const openEditForm = (drug: Drug) => {
    setCurrentDrug(drug);
    setIsFormOpen(true);
  };

  const filteredDrugs = drugs.filter((drug) =>
    drug.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Manage Drugs">
      <div className="bg-white shadow-sm mb-6 p-4 border border-gray-100 rounded-lg">
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
          <div className="relative flex-1">
            <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search drugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 border border-gray-300 focus:border-[#22c3dd] rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
            />
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex justify-center items-center bg-[#22c3dd] hover:bg-[#1ba8c1] px-4 py-2 rounded-md focus:outline-none text-white"
          >
            <Plus size={18} className="mr-1" />
            <span>Add New Drug</span>
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <DrugForm
            onSubmit={currentDrug ? handleUpdateDrug : handleCreateDrug}
            initialValues={currentDrug || undefined}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      <AnimatePresence>
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <Loader2 className="mb-4 w-12 h-12 text-[#22c3dd] animate-spin" />
            <p className="font-medium text-gray-500">
              Loading your drugs inventory...
            </p>
          </div>
        ) : filteredDrugs.length === 0 ? (
          <div className="bg-white shadow-sm p-8 border border-gray-100 rounded-lg text-center">
            {searchTerm ? (
              <>
                <Search size={48} className="mx-auto mb-2 text-gray-300" />
                <h3 className="mt-2 font-medium text-gray-700 text-lg">
                  No matching drugs found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try a different search term
                </p>
              </>
            ) : (
              <>
                <Pill size={48} className="mx-auto mb-2 text-gray-300" />
                <h3 className="mt-2 font-medium text-gray-700 text-lg">
                  No drugs added yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Click 'Add New Drug' to add your first drug
                </p>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center bg-[#22c3dd] hover:bg-[#1ba8c1] mt-4 px-4 py-2 rounded-md focus:outline-none text-white"
                >
                  <Plus size={16} className="mr-1" />
                  <span>Add New Drug</span>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {filteredDrugs.map((drug) => (
              <DrugCard
                key={drug.id}
                drug={drug}
                onEdit={openEditForm}
                onDelete={handleDeleteDrug}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DrugsPage;
