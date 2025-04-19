import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import PatientSignUpForm from "../Ui/patientSignUpForm";
import Person from "../assets/ph.jpg";
import PharmacySignUpForm from "../Ui/PharmSignUp";

type SignupProps = {
  role: "patient" | "pharmacy";
};

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<
    "patient" | "pharmacy" | null
  >(null);

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <motion.div
            className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-3xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Logo />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              SELECT USER TYPE
            </h2>
            <div className="h-1 w-10 bg-[#22c3dd] mx-auto rounded-full mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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

            <div className="text-sm text-gray-500">
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
    <div className="h-screen grid md:grid-cols-2 grid-cols-1">
      <div className="hidden md:block">
        <div className="sticky top-0 h-screen">
          <img src={Person} className="h-full w-full object-cover" alt="" />
        </div>
      </div>
      <div className="md:p-1 p-8">
        {role === "patient" ? <PatientSignUpForm /> : <PharmacySignUpForm />}
      </div>
    </div>
  );
};

export default RoleSelection;
