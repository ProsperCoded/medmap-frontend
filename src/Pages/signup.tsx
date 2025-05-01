import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import UserSignUpForm from "../Ui/UserSignUpForm";
import Person from "../assets/ph.jpg";
import PharmacySignUpForm from "../Ui/PharmSignUp";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

type SignupProps = {
  role: "user" | "pharmacy";
};

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<"user" | "pharmacy" | null>(
    null
  );

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage");
    }
  }, [isAuthenticated, navigate]);

  const roles = [
    {
      id: "user",
      icon: <span className="text-3xl">👤</span>,
      label: "user",
    },
    {
      id: "pharmacy",
      icon: <span className="text-3xl">🏥</span>,
      label: "Pharmacy",
    },
  ];

  return (
    <div className="">
      {!selectedRole ? (
        <div className="relative flex justify-center items-center bg-[#f0f8ff] px-4 min-h-screen overflow-hidden">
          {/* Floating animated elements */}
          <div className="top-[-20px] right-[-20px] floating-element-slow absolute bg-[#bbdefb] opacity-30 rounded-full w-60 h-60"></div>
          <div className="bottom-20 left-10 floating-element absolute bg-[#e3f2fd] opacity-40 rounded-full w-40 h-40"></div>

          <motion.div
            className="z-10 relative bg-white shadow-2xl p-10 rounded-xl w-full max-w-3xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
            <h2 className="mb-1 font-bold text-[#1a2b4a] text-2xl">
              SELECT USER TYPE
            </h2>
            <div className="mx-auto mb-6 rounded-full w-10 h-1 gradient-bg" />

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-10">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() =>
                    setSelectedRole(role.id as "user" | "pharmacy")
                  }
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 shadow-sm ${
                    selectedRole === role.id
                      ? "gradient-bg text-white border-[#29b6f6] shadow-lg scale-105"
                      : "bg-white border-[#bbdefb] text-[#1a2b4a] hover:border-[#29b6f6] hover:scale-105"
                  }`}
                >
                  {role.icon}
                  <span className="mt-3 font-medium text-lg">{role.label}</span>
                </button>
              ))}
            </div>

            <div className="text-[#5d8cb3] text-sm">
              Click a user type to continue
            </div>
          </motion.div>
        </div>
      ) : (
        <Signup role={selectedRole} />
      )}
    </div>
  );
};

const Signup = ({ role }: SignupProps) => {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 bg-[#f0f8ff] h-screen overflow-hidden">
      <div className="hidden md:block">
        <div className="top-0 relative sticky h-screen">
          <img src={Person} className="w-full h-full object-cover" alt="" />
          {/* Overlay with gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 136, 229, 0.5) 0%, rgba(0, 188, 212, 0.5) 100%)",
              mixBlendMode: "multiply",
            }}
          ></div>
        </div>
      </div>
      <div className="z-10 relative p-8 md:p-1">
        {/* Floating animated elements */}
        <div className="top-20 right-10 floating-element-slow absolute bg-[#e3f2fd] opacity-30 rounded-full w-32 h-32"></div>
        <div className="right-20 bottom-40 floating-element absolute bg-[#bbdefb] opacity-40 rounded-full w-24 h-24"></div>

        {role === "user" ? <UserSignUpForm /> : <PharmacySignUpForm />}
      </div>
    </div>
  );
};

export default RoleSelection;
