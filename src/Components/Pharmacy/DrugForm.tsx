import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  X,
  Loader2,
  Calendar,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react";
import type { Drug } from "../../lib/Types/response.type";
import { IllnessPicker } from "./IllnessPicker";
import { TagInput } from "./TagInput";

interface DrugFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  initialValues?: Drug;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const DrugForm = ({
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
    initialValues?.sideEffects || []
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
  const [uses, setUses] = useState<string[]>(initialValues?.uses || []);
  const [selectedIllnesses, setSelectedIllnesses] = useState<string[]>(
    initialValues?.illnessDrugs?.map((id) => id.illness.id) || []
  );
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialValues?.imageUrl || ""
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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
    if (sideEffects.length === 0)
      errors.sideEffects = "At least one side effect is required";
    if (selectedIllnesses.length === 0)
      errors.illnesses = "At least one illness must be selected";

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
    formData.append("expiryDate", new Date(expiryDate).toISOString());
    formData.append("price", price);
    formData.append("stocks", stocks);
    formData.append("composition", composition);
    formData.append("manufacturer", manufacturer);
    uses.forEach((use) => {
      if (use.trim()) formData.append("uses", use);
    });
    selectedIllnesses.forEach((id) => {
      formData.append("illnessIds", id);
    });

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
              className={`w-full p-2 border ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd]`}
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

          <TagInput
            label="Side Effects"
            values={sideEffects}
            onChange={setSideEffects}
            placeholder="Type a side effect and press Enter..."
            required
            error={validationErrors.sideEffects}
          />

          <TagInput
            label="Uses"
            values={uses}
            onChange={setUses}
            placeholder="Type a use case and press Enter..."
          />

          <IllnessPicker
            selectedIllnesses={selectedIllnesses}
            onIllnessesChange={setSelectedIllnesses}
          />
          {validationErrors.illnesses && (
            <p className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle size={14} className="mr-1" />
              {validationErrors.illnesses}
            </p>
          )}
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
