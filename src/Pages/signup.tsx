import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import PatientSignUpForm from "../Ui/patientSignUpForm";
import Person from "../assets/ph.jpg";
import PharmacySignUpForm from "../Ui/PharmSignUp";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

type SignupProps = {
  role: "patient" | "pharmacy";
};

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "pharmacy" | null
  >(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/homepage");
    }
  }, [isAuthenticated, navigate]);

  const roles = [
    {
      id: "patient",
      icon: <span className="text-3xl">👤</span>,
      label: "Patient",
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
        <div className="flex justify-center items-center bg-gray-100 px-4 min-h-screen">
          <motion.div
            className="bg-white shadow-2xl p-10 rounded-xl w-full max-w-3xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
            <h2 className="mb-1 font-bold text-gray-800 text-2xl">
              SELECT USER TYPE
            </h2>
            <div className="bg-[#22c3dd] mx-auto mb-6 rounded-full w-10 h-1" />

            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-10">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() =>
                    setSelectedRole(role.id as "patient" | "pharmacy")
                  }
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? "bg-[#22c3dd] text-white border-[#22c3dd] shadow-lg scale-105"
                      : "bg-white border-gray-300 text-gray-700 hover:border-[#22c3dd] hover:scale-105"
                  }`}
                >
                  {role.icon}
                  <span className="mt-3 font-medium text-lg">{role.label}</span>
                </button>
              ))}
            </div>

            <div className="text-gray-500 text-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="hidden md:block">
        <div className="top-0 sticky h-screen">
          <img src={Person} className="w-full h-full object-cover" alt="" />
        </div>
      </div>
      <div className="p-8 md:p-1">
        {role === "patient" ? <PatientSignUpForm /> : <PharmacySignUpForm />}
      </div>
    </div>
  );
};

export default RoleSelection;
