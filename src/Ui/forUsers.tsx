import { motion } from "framer-motion";
import { User, ShieldCheck, Check } from "lucide-react";

const users = [
  {
    role: "For Users",
    icon: <User className="w-6 h-6 text-[#1e88e5]" />,
    points: [
      "Find medications quickly at nearby pharmacies",
      "Compare prices and availability",
      "Get directions to the pharmacy",
      "Learn about medications through our AI assistant",
    ],
  },
  {
    role: "For Pharmacies",
    icon: <ShieldCheck className="w-6 h-6 text-[#00bcd4]" />,
    points: [
      "Increase visibility to potential customers",
      "List available medications and pricing",
      "Track medication inventory and analytics",
      "Reach users looking for specific medications",
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const ForUsers = () => {
  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Floating animated elements */}
      <div className="right-10 bottom-10 floating-element-slow absolute bg-[#e3f2fd] opacity-40 rounded-full w-40 h-40"></div>
      <div className="top-20 left-1/3 floating-element absolute bg-[#bbdefb] opacity-60 rounded-full w-20 h-20"></div>

      <h2 className="z-10 relative mb-14 font-semibold text-[#1a2b4a] text-4xl text-center tracking-wide">
        For Users and Pharmacies
      </h2>
      <div className="z-10 relative gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-6 max-w-6xl">
        {users.map((user, index) => {
          const isUserCard = index === 0;
          const gradientStyle = isUserCard
            ? {
                background: "linear-gradient(135deg, #1e88e5 0%, #29b6f6 100%)",
              }
            : {
                background: "linear-gradient(135deg, #29b6f6 0%, #00bcd4 100%)",
              };

          return (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="group relative bg-white shadow-md hover:shadow-lg p-8 border border-[#bbdefb] rounded-2xl overflow-hidden transition-shadow"
            >
              {/* Top Accent Bar */}
              <div
                className="top-0 left-0 absolute rounded-t-2xl w-full h-2"
                style={gradientStyle}
              />

              {/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <div>{user.icon}</div>
                <h3 className="font-semibold text-[#1a2b4a] text-xl">
                  {user.role}
                </h3>
              </div>

              {/* List */}
              <ul className="space-y-4">
                {user.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className={`rounded-full p-1 ${
                        isUserCard
                          ? "bg-[#e3f2fd] text-[#1e88e5]"
                          : "bg-[#e1f5fe] text-[#00bcd4]"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-[#5d8cb3] text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ForUsers;
