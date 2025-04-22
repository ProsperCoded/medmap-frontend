import { motion } from "framer-motion";
import { Pill, Edit, Trash2, Package, DollarSign } from "lucide-react";
import type { Drug } from "../../lib/Types/response.type";

interface DrugCardProps {
  drug: Drug;
  onEdit: (drug: Drug) => void;
  onDelete: (id: string) => void;
}

export const DrugCard = ({ drug, onEdit, onDelete }: DrugCardProps) => (
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
        {drug.illnessDrugs?.map((illnessDrug) => (
          <span
            key={illnessDrug.illness.id}
            className="inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs"
          >
            Cures: {illnessDrug.illness.name}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);
