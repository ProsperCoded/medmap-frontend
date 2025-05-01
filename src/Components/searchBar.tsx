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
      className="relative flex items-center bg-white shadow-md mx-auto border-[#bbdefb] border-2 focus-within:border-[#29b6f6] rounded-full w-full max-w-xl overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search for medications..."
        className="flex-grow px-4 py-3 focus:outline-none w-full text-[#1a2b4a] text-sm md:text-base placeholder-[#5d8cb3]"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <Search className="hidden md:block mx-2 w-5 h-5 text-[#5d8cb3]" />
      <button
        type="submit"
        className="hover:opacity-90 shadow-sm px-3 md:px-4 py-3 rounded-r-full text-white text-sm md:text-base whitespace-nowrap transition-all gradient-bg"
      >
        Search
      </button>
    </form>
  );
};

export default MedicationSearchBar;
