import { Search } from "lucide-react"; // Lucide icon

const MedicationSearchBar = () => {
  return (
    <div className="flex items-center w-full max-w-xl mx-auto bg-white border-2 border-sky-200 rounded-full overflow-hidden shadow-sm focus-within:border-sky-400">
      <input
        type="text"
        placeholder="Search for medications..."
        className="flex-grow px-4 py-2 text-gray-700 placeholder-gray-300 focus:outline-none"
      />
      <Search className="mx-2 text-gray-400 w-5 h-5" />
      <button className="bg-[#22c3dd] hover:bg-[#56c2d3] text-white px-4 py-2 rounded-r-full transition-colors">
        Search
      </button>
    </div>
  );
};

export default MedicationSearchBar;
