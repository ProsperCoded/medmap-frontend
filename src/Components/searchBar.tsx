import { Search } from "lucide-react"; // Lucide icon
import React, { useState } from "react";

interface MedicationSearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
  onChange?: (value: string) => void;
}

const MedicationSearchBar: React.FC<MedicationSearchBarProps> = ({
  onSearch,
  value = "",
  onChange,
}) => {
  const [searchQuery, setSearchQuery] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    if (onChange) onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-white shadow-sm mx-auto border-2 border-sky-200 focus-within:border-sky-400 rounded-full w-full max-w-xl overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search for medications..."
        className="flex-grow px-4 py-2 focus:outline-none text-gray-700 placeholder-gray-300"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Search className="mx-2 w-5 h-5 text-gray-400" />
      <button
        type="submit"
        className="bg-[#22c3dd] hover:bg-[#56c2d3] px-4 py-2 rounded-r-full text-white transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default MedicationSearchBar;
