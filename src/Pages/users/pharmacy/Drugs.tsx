import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../Components/Pharmacy/DashboardLayout";
import {
  getMyDrugs,
  createDrug,
  updateDrug,
  deleteDrug,
} from "../../../api/Pharmacy/drug.api";
import type { Drug, Response } from "../../../lib/Types/response.type";
import { toast } from "react-hot-toast";
import {
  Pill,
  Plus,
  Trash2,
  Edit,
  Search,
  AlertCircle,
  X,
  Loader2,
  Calendar,
  DollarSign,
  Package,
} from "lucide-react";

interface DrugFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialValues?: Drug;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DrugForm = ({
  onSubmit,
  initialValues,
  onCancel,
  isSubmitting,
}: DrugFormProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(
    initialValues?.description || ""
  );
  const [sideEffects, setSideEffects] = useState<string[]>(
    initialValues?.sideEffects || [""]
  );
  const [expiryDate, setExpiryDate] = useState(
    initialValues?.expiryDate
      ? new Date(initialValues.expiryDate).toISOString().split("T")[0]
      : ""
  );
  const [price, setPrice] = useState(initialValues?.price?.toString() || "");
  const [stocks, setStocks] = useState(
    initialValues?.stocks?.toString() || "1"
  );
  const [composition, setComposition] = useState(
    initialValues?.composition || ""
  );
  const [manufacturer, setManufacturer] = useState(
    initialValues?.manufacturer || ""
  );
  const [uses, setUses] = useState(initialValues?.uses || "");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialValues?.imageUrl || ""
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSideEffectsChange = (index: number, value: string) => {
    const updatedSideEffects = [...sideEffects];
    updatedSideEffects[index] = value;
    setSideEffects(updatedSideEffects);
  };

  const addSideEffect = () => {
    setSideEffects([...sideEffects, ""]);
  };

  const removeSideEffect = (index: number) => {
    const updatedSideEffects = sideEffects.filter((_, i) => i !== index);
    setSideEffects(updatedSideEffects);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Drug name is required";
    if (!expiryDate) errors.expiryDate = "Expiry date is required";
    if (!price || isNaN(Number(price)) || Number(price) < 0)
      errors.price = "Valid price is required";
    if (!stocks || isNaN(Number(stocks)) || Number(stocks) < 0)
      errors.stocks = "Valid stock count is required";

    const emptySideEffects = sideEffects.some((effect) => !effect.trim());
    if (sideEffects.length === 0 || emptySideEffects)
      errors.sideEffects = "At least one side effect is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    sideEffects.forEach((effect) => {
      if (effect.trim()) formData.append("sideEffects", effect);
    });
    formData.append("expiryDate", expiryDate);
    formData.append("price", price);
    formData.append("stocks", stocks);
    formData.append("composition", composition);
    formData.append("manufacturer", manufacturer);
    formData.append("uses", uses);

    if (image) {
      formData.append("image", image);
    }

    await onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm p-6 border border-gray-100 rounded-lg"
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-gray-100 border-b">
        <h2 className="flex items-center font-semibold text-gray-800 text-xl">
          <Pill className="mr-2 text-[#22c3dd]" size={20} />
          {initialValues ? "Edit Drug" : "Add New Drug"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Drug Name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-2 border rounded-md ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
            />
            {validationErrors.name && (
              <p className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">
              Side Effects*
            </label>
            {sideEffects.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={effect}
                  onChange={(e) =>
                    handleSideEffectsChange(index, e.target.value)
                  }
                  className={`flex-1 p-2 border ${
                    validationErrors.sideEffects
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
                  placeholder="Enter side effect"
                />
                <button
                  type="button"
                  onClick={() => removeSideEffect(index)}
                  disabled={sideEffects.length === 1}
                  className={`p-2 text-red-500 rounded-md hover:bg-red-50 ${
                    sideEffects.length === 1 && "opacity-50 cursor-not-allowed"
                  }`}
                  aria-label="Remove side effect"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSideEffect}
              className="flex items-center p-2 text-[#22c3dd] hover:text-[#1ba8c1] text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Another Side Effect
            </button>
            {validationErrors.sideEffects && (
              <p className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.sideEffects}
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div className="gap-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="expiryDate"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Expiry Date*
              </label>
              <div className="relative">
                <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={`w-full pl-9 p-2 border ${
                    validationErrors.expiryDate
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
                />
              </div>
              {validationErrors.expiryDate && (
                <p className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {validationErrors.expiryDate}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Price (₦)*
              </label>
              <div className="relative">
                <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full pl-9 p-2 border ${
                    validationErrors.price
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
                />
              </div>
              {validationErrors.price && (
                <p className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {validationErrors.price}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="stocks"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Stock Count*
            </label>
            <div className="relative">
              <div className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2">
                <Package size={16} />
              </div>
              <input
                type="number"
                id="stocks"
                value={stocks}
                onChange={(e) => setStocks(e.target.value)}
                min="0"
                className={`w-full pl-9 p-2 border ${
                  validationErrors.stocks ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
              />
            </div>
            {validationErrors.stocks && (
              <p className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {validationErrors.stocks}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="composition"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Composition
            </label>
            <input
              type="text"
              id="composition"
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
            />
          </div>

          <div className="gap-4 grid grid-cols-2">
            <div>
              <label
                htmlFor="manufacturer"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Manufacturer
              </label>
              <input
                type="text"
                id="manufacturer"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
              />
            </div>
            <div>
              <label
                htmlFor="uses"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Uses
              </label>
              <input
                type="text"
                id="uses"
                value={uses}
                onChange={(e) => setUses(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Drug Image
            </label>
            <div className="flex items-center mt-1">
              {previewUrl && (
                <div className="relative mr-4">
                  <img
                    src={previewUrl}
                    alt="Drug preview"
                    className="border border-gray-300 rounded-md w-24 h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setPreviewUrl("");
                    }}
                    className="-top-2 -right-2 absolute bg-white shadow-sm p-1 border border-gray-300 rounded-full"
                    aria-label="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <label
                htmlFor="image-upload"
                className="inline-flex items-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none font-medium text-gray-700 text-sm cursor-pointer"
              >
                {previewUrl ? "Change Image" : "Upload Image"}
                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            <p className="mt-2 text-gray-500 text-xs">
              JPG, JPEG or PNG. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center bg-[#22c3dd] hover:bg-[#1ba8c1] px-4 py-2 rounded-md focus:outline-none text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {initialValues ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{initialValues ? "Update Drug" : "Create Drug"}</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

const DrugCard = ({
  drug,
  onEdit,
  onDelete,
}: {
  drug: Drug;
  onEdit: (drug: Drug) => void;
  onDelete: (id: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-lg transition-all"
  >
    <div className="flex items-center">
      <div className="flex-shrink-0 bg-gray-100 rounded-md w-16 h-16 overflow-hidden">
        {drug.imageUrl ? (
          <img
            src={drug.imageUrl}
            alt={drug.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center bg-gray-100 w-full h-full">
            <Pill size={24} className="text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-gray-800">{drug.name}</h3>
        <div className="flex items-center mt-1 text-gray-500 text-sm">
          <span className="flex items-center">
            <Package size={14} className="mr-1" />
            {drug.stocks} in stock
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <DollarSign size={14} className="mr-1" />₦
            {drug.price.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex space-x-1 ml-4">
        <button
          onClick={() => onEdit(drug)}
          className="hover:bg-blue-50 p-2 rounded-full text-blue-500"
          aria-label="Edit drug"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(drug.id)}
          className="hover:bg-red-50 p-2 rounded-full text-red-500"
          aria-label="Delete drug"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    {drug.description && (
      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
        {drug.description}
      </p>
    )}

    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {drug.expiryDate && (
          <span className="inline-flex items-center bg-amber-100 px-2.5 py-0.5 rounded-full font-medium text-amber-800 text-xs">
            Expires: {new Date(drug.expiryDate).toLocaleDateString()}
          </span>
        )}
        {drug.stocks <= 10 && (
          <span className="inline-flex items-center bg-red-100 px-2.5 py-0.5 rounded-full font-medium text-red-800 text-xs">
            Low Stock
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col justify-center items-center py-16"
          >
            <Loader2 className="mb-4 w-12 h-12 text-[#22c3dd] animate-spin" />
            <p className="font-medium text-gray-500">
              Loading your drugs inventory...
            </p>
          </motion.div>
        ) : filteredDrugs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-sm p-8 border border-gray-100 rounded-lg text-center"
          >
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
          </motion.div>
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
