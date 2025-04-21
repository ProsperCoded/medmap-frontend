import { Locate } from "lucide-react";
import Logo from "../Logo";
import { IconButton, Tooltip } from "@mui/material";

const Nav = () => {
  return (
    <div>
      <div className="border-b border-gray-300">
        <div className="flex justify-between items-center px-5 py-2">
          <Logo />
          <div className="flex items-center">
            <div
              aria-label="Locate Nearby"
              className="bg-[#22c3dd] rounded-md text-white hover:bg-[#38d3ea] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c3dd] mr-3"
            >
              <Tooltip title="Explore">
                <IconButton>
                  <Locate size={16} />
                </IconButton>
              </Tooltip>
            </div>

            <div className="w-6">
              <svg
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g fill="#22c3dd">
                  <path d="M320,64 L320,320 L64,320 L64,64 L320,64 Z M171.749388,128 L146.817842,128 L99.4840387,256 L121.976629,256 L130.913039,230.977 L187.575039,230.977 L196.319607,256 L220.167172,256 L171.749388,128 Z M260.093778,128 L237.691519,128 L237.691519,256 L260.093778,256 L260.093778,128 Z M159.094727,149.47526 L181.409039,213.333 L137.135039,213.333 L159.094727,149.47526 Z" />
                </g>
              </svg>
            </div>
            <span className="text-gray-900">Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
