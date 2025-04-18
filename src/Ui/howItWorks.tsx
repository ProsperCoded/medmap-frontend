import { motion } from "framer-motion";
import { Search, MapPin, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-10 h-10 text-sky-400" />,
    title: "Search",
    description:
      "Enter your medication name and we'll find pharmacies that have it in stock.",
  },
  {
    icon: <MapPin className="w-10 h-10 text-sky-400" />,
    title: "Locate",
    description:
      "See nearby pharmacies sorted by distance, with availability and pricing information.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-sky-400" />,
    title: "Learn",
    description:
      "Get medication information and assistance through our AI chatbot assistant.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 1,
      ease: "easeOut",
    },
  }),
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-4xl font-semibold text-center text_dark mb-14">
        How Med<span className="heading text-[#22c3dd] ">Map</span> works
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="group bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default"
          >
            <div className="flex justify-center items-center mb-4">
              <div className="p-4 rounded-full bg-sky-100 group-hover:scale-110 transform transition">
                {step.icon}
              </div>
            </div>
            <h3 className="text-xl font-semibold heading text_dark mb-2 tracking-wide">
              {step.title}
            </h3>
            <p className="text-sm text_dark_mid leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
