import { motion } from "framer-motion";
import { User, ShieldCheck, Check } from "lucide-react";

const users = [
  {
    role: "For Patients",
    color: "sky",
    icon: <User className="text-sky-400 w-6 h-6" />,
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
    icon: <ShieldCheck className="text-lime-500 w-6 h-6" />,
    points: [
      "Increase visibility to potential customers",
      "List available medications and pricing",
      "Track medication inventory and analytics",
      "Reach patients looking for specific medications",
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
    <section className="py-20 bg-gray-50">
      <h2 className="text-4xl font-semibold tracking-wide text-center text-gray-900 mb-14">
        For Patients and Pharmacies
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
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
              <h3 className="text-xl font-semibold text-gray-900">
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
