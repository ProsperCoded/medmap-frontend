import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-700 py-8  border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 text-center space-y-2">
        <p className="text-sm font-medium">
          &copy; {year} Med
          <span className="heading text-[#22c3dd]">Map</span>. All
          rights reserved.
        </p>
        <p className="text-sm">
          Helping connect patients with the medications they need.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
