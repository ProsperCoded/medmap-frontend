import Nav from "../../Components/user/Nav";

const SearchPage = () => {
  return (
    <div className="min-h-screen text-white">
      <Nav />
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            className="flex items-center gap-1 text-black hover:text-[#22c3dd] transition duration-200"
            onClick={() => window.history.back()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search for medication..."
              className="w-full pl-10 pr-4 py-2 text-zinc-900 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22c3dd] border border-zinc-700 transition"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"
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
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
