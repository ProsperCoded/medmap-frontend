import logoSmall from "./../assets/logo-small.png";
const Logo = () => {
  return (
    <div className="flex items-center gap-2 logo_container">
      <img src={logoSmall} alt="MedMap Logo" className="rounded-full w-10" />
      <p className="text-gray-900 text-lg">
        Med<span className="text-[#22c3dd] text-xl heading">Map</span>
      </p>
    </div>
  );
};

export default Logo;
