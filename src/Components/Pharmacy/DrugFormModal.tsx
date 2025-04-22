import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import type { Drug } from "../../lib/Types/response.type";
import { createDrug, updateDrug } from "../../api/Pharmacy/drug.api";

interface DrugFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  drug?: Drug;
}

const DrugFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  drug,
}: DrugFormModalProps) => {
  const [formData, setFormData] = useState({
    name: drug?.name || "",
    description: drug?.description || "",
    sideEffects: drug?.sideEffects?.join(", ") || "",
    expiryDate: drug?.expiryDate
      ? new Date(drug.expiryDate).toISOString().split("T")[0]
      : "",
    price: drug?.price || 0,
    stocks: drug?.stocks || 1,
    composition: drug?.composition || "",
    manufacturer: drug?.manufacturer || "",
    uses: drug?.uses || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "sideEffects") {
          // Convert comma-separated string to array
          const effects = value.split(",").map((effect) => effect.trim());
          form.append(key, JSON.stringify(effects));
        } else {
          form.append(key, value.toString());
        }
      });

      if (image) {
        form.append("image", image);
      }

      const response = drug
        ? await updateDrug(drug.id, form)
        : await createDrug(form);

      if (response.status === "success") {
        toast.success(response.message);
        onSuccess();
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to save drug");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="z-50 fixed inset-0 overflow-y-auto">
          <div className="flex justify-center items-center p-4 min-h-screen">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="z-10 relative bg-white shadow-xl p-6 rounded-lg w-full max-w-2xl"
            >
              <h2 className="mb-4 font-bold text-2xl">
                {drug ? "Edit Drug" : "Add New Drug"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <label className="block font-medium text-gray-700 text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 text-sm">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value),
                        }))
                      }
                      className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 text-sm">
                      Stocks
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stocks}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stocks: parseInt(e.target.value),
                        }))
                      }
                      className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 text-sm">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Side Effects (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sideEffects}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sideEffects: e.target.value,
                      }))
                    }
                    className="block shadow-sm mt-1 border-gray-300 focus:border-[#22c3dd] rounded-md focus:ring-[#22c3dd] w-full"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 text-sm">
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="block mt-1 w-full"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#22c3dd] hover:bg-[#1baac5] disabled:opacity-50 px-4 py-2 rounded-md text-white"
                  >
                    {isLoading ? "Saving..." : "Save Drug"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DrugFormModal;
