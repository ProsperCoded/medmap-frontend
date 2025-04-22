import { motion } from "framer-motion";
import { User, ShieldCheck, Check } from "lucide-react";

const users = [
  {
    role: "For Users",
    color: "sky",
    icon: <User className="w-6 h-6 text-sky-400" />,
    points: [
      "Find medications quickly at nearby pharmacies",
      "Compare prices and availability",
      "Get directions to the pharmacy",
      "Learn about medications through our AI assistant",
    ],
  },
  {
    role: "For Pharmacies",
    color: "lime",
    icon: <ShieldCheck className="w-6 h-6 text-lime-500" />,
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
    <section className="bg-gray-50 py-20">
      <h2 className="mb-14 font-semibold text-gray-900 text-4xl text-center tracking-wide">
        For Users and Pharmacies
      </h2>
      <div className="gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-6 max-w-6xl">
        {users.map((user, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className={`rounded-2xl shadow-sm border border-gray-200 bg-white p-8 relative overflow-hidden group hover:shadow-md transition-shadow`}
          >
            {/* Top Accent Bar */}
            <div
              className={`absolute top-0 left-0 h-2 w-full rounded-t-2xl bg-${user.color}-400`}
            />

            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <div>{user.icon}</div>
              <h3 className="font-semibold text-gray-900 text-xl">
                {user.role}
              </h3>
            </div>

            {/* List */}
            <ul className="space-y-4">
              {user.points.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span
                    className={`bg-${user.color}-100 text-${user.color}-500 rounded-full p-1`}
                  >
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="text-gray-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ForUsers;
