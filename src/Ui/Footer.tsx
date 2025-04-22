import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-gray-200 border-t text-gray-700">
      <div className="space-y-2 mx-auto px-6 max-w-6xl text-center">
        <p className="font-medium text-sm">
          &copy; {year} Med
          <span className="text-[#22c3dd] heading">Map</span>. All rights
          reserved.
        </p>
        <p className="text-sm">
          Helping connect users with the medications they need.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
