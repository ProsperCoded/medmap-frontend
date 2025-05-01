import { useState, useEffect } from "react";
import logoSmall from "./../assets/logo-small.png";

const Logo = () => {
  const [rotation, setRotation] = useState(0);

  // Subtle animation effect for the logo
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 logo_container">
      <div className="relative">
        {/* Logo image with gradient overlay and animation */}
        {/* <div
          className="absolute inset-0 rounded-full w-10 h-10"
          style={{
            background: `linear-gradient(${rotation}deg, #1e88e5, #00bcd4, #29b6f6)`,
            opacity: 0.8,
            filter: "blur(1px)",
            transform: `scale(${1 + Math.sin(rotation / 30) * 0.05})`,
          }}
        /> */}
        <img
          src={logoSmall}
          alt="MedMap Logo"
          className="z-10 relative rounded-full w-10"
          style={{ filter: "contrast(1.1) brightness(1.05)" }}
        />
      </div>

      <div className="flex items-center">
        <p
          className="bg-clip-text font-semibold text-transparent text-lg"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #1a2b4a 0%, #1e88e5 100%)",
          }}
        >
          Med
        </p>
        <span
          className="relative bg-clip-text font-bold text-transparent text-xl heading"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #00bcd4 0%, #1e88e5 50%, #00bcd4 100%)",
            backgroundSize: "200% auto",
            animation: "gradient 3s linear infinite",
          }}
        >
          Map
          {/* Decorative elements */}
          <span
            className="-top-1 -right-1 absolute rounded-full w-1.5 h-1.5"
            style={{
              background: "#00bcd4",
              boxShadow: "0 0 5px 1px rgba(0, 188, 212, 0.7)",
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default Logo;
