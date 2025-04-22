import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export const TagInput = ({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter...",
  required = false,
  error,
}: TagInputProps) => {
  const [currentInput, setCurrentInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInput.trim()) {
      e.preventDefault();
      if (!values.includes(currentInput.trim())) {
        onChange([...values, currentInput.trim()]);
      }
      setCurrentInput("");
    } else if (e.key === "Backspace" && !currentInput && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(values.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700 text-sm">
        {label}
        {required && "*"}
      </label>
      <div
        className={`p-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus-within:ring-2 focus-within:ring-[#22c3dd] focus-within:border-[#22c3dd]`}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          {values.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center bg-[#22c3dd] bg-opacity-10 px-3 py-1 rounded-full"
            >
              <span className="text-sky-50 text-sm">{tag}</span>
              <button
                onClick={() => removeTag(index)}
                className="ml-2 focus:outline-none text-sky-50 hover:text-sky-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="focus:outline-none w-full text-gray-700 placeholder-gray-400"
        />
      </div>
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
