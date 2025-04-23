import { useState, useCallback, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { searchIllnesses } from "../../api/illness.api";
import { Illness } from "../../lib/Types/response.type";
import debounce from "lodash/debounce";

interface IllnessPickerProps {
  selectedIllnesses: string[];
  onIllnessesChange: (illnessIds: string[]) => void;
}

export const IllnessPicker = ({
  selectedIllnesses,
  onIllnessesChange,
}: IllnessPickerProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Illness[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIllnessDetails, setSelectedIllnessDetails] = useState<
    Illness[]
  >([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchIllnesses({
          query: searchQuery,
          limit: 5,
        });
        if (response.status === "success") {
          setSuggestions(response.data.data);
        }
      } catch (error) {
        console.error("Error searching illnesses:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const handleSelect = (illness: Illness) => {
    if (!selectedIllnesses.includes(illness.id)) {
      const newSelectedIds = [...selectedIllnesses, illness.id];
      onIllnessesChange(newSelectedIds);
      setSelectedIllnessDetails([...selectedIllnessDetails, illness]);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleRemove = (illnessId: string) => {
    const newSelectedIds = selectedIllnesses.filter((id) => id !== illnessId);
    onIllnessesChange(newSelectedIds);
    setSelectedIllnessDetails(
      selectedIllnessDetails.filter((illness) => illness.id !== illnessId)
    );
  };

  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-700 text-sm">
        Drug Cures*
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Type to search illnesses..."
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#22c3dd] w-full"
        />
        {isLoading && (
          <div className="top-1/2 right-2 absolute -translate-y-1/2">
            <Loader2 size={16} className="text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="z-10 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded-md w-full max-h-60 overflow-auto">
          {suggestions.map((illness) => (
            <button
              key={illness.id}
              onClick={() => {
                handleSelect(illness);
                setIsDropdownOpen(false);
              }}
              className="hover:bg-gray-50 focus:bg-gray-50 px-4 py-2 focus:outline-none w-full text-left"
            >
              <div className="font-medium text-gray-800">{illness.name}</div>
              {illness.description && (
                <div className="text-gray-500 text-sm truncate">
                  {illness.description}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected illnesses */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedIllnessDetails.map((illness) => (
          <div
            key={illness.id}
            className="inline-flex items-center bg-[#22c3dd] bg-opacity-10 px-3 py-1 rounded-full"
          >
            <span className="text-sky-50 text-sm">{illness.name}</span>
            <button
              onClick={() => handleRemove(illness.id)}
              className="ml-2 focus:outline-none text-sky-50 hover:text-sky-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
