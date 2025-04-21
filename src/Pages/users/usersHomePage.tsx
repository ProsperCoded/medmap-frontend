import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import HowItWorks from "../../Ui/howItWorks";
import ForUsers from "../../Ui/forUsers";
import Footer from "../../Ui/Footer";
import Nav from "../../Components/user/Nav";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [recents, setRecents] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedRecents = localStorage.getItem("recentSearches");
      if (storedRecents) {
        const parsed = JSON.parse(storedRecents);
        if (Array.isArray(parsed)) {
          setRecents(parsed);
          console.log("Loaded recent searches from localStorage", parsed);
        }
      }
    } catch (error) {
      console.error("Failed to parse recentSearches:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recents));
  }, [recents]);

  const handleSearch = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue && !recents.includes(trimmedValue)) {
      setRecents((prev) => [trimmedValue, ...prev].slice(0, 5));
    }

    // Redirect to the search results page with the search value
    navigate(`/search_result/${encodeURIComponent(trimmedValue)}`);
    setSearchValue("");
  };

  const removeItem = (item: string) => {
    setRecents((prev) => prev.filter((r) => r !== item));
  };

  const handleRecentClick = (item: string) => {
    setSearchValue(item);
  };

  return (
    <div>
      <Nav />
      <div className="w-10/12 mx-auto py-8">
        <div className="text-center">
          <h1 className="md:text-7xl text-3xl">
            Find <span className="heading">Your</span> Medication
          </h1>
          <p className="text-md">
            Locate the nearest pharmacy with your{" "}
            <span className="heading text-[#22c3dd]">prescription</span> in
            stock, instantly
          </p>
          <div className="relative w-full max-w-xl mx-auto mt-10 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search for medication..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 text-white placeholder-zinc-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#22c3dd]"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#22c3dd] text-white rounded-full hover:bg-[#1ca7ba] transition"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>

        {recents.length > 0 && (
          <div className="mb-6 w-full max-w-xl mx-auto">
            <h2 className="flex items-center mt-3 mb-1 gap-2">
              <Clock size={14} className="text-gray-600" />
              <small className="text-gray-500">Recent Searches</small>
            </h2>
            <div className="flex flex-wrap gap-3">
              {recents.map((item) => (
                <div
                  key={item}
                  className="flex cursor-pointer items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                  onClick={() => handleRecentClick(item)}
                >
                  <span>{item}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item);
                    }}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <HowItWorks />
        <ForUsers />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
