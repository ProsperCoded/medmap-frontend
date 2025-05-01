import { motion } from "framer-motion";
import { Search, MapPin, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-10 h-10 text-[#29b6f6]" />,
    title: "Search",
    description:
      "Enter your medication name and we'll find pharmacies that have it in stock.",
  },
  {
    icon: <MapPin className="w-10 h-10 text-[#29b6f6]" />,
    title: "Locate",
    description:
      "See nearby pharmacies sorted by distance, with availability and pricing information.",
  },
  {
    icon: <MessageCircle className="w-10 h-10 text-[#29b6f6]" />,
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
    <section className="relative bg-[#f0f8ff] py-20 overflow-hidden">
      {/* Floating animated elements */}
      <div className="top-20 left-10 floating-element-slow absolute bg-[#e1f5fe] opacity-70 rounded-full w-32 h-32"></div>
      <div className="top-40 right-20 floating-element absolute bg-[#bbdefb] opacity-60 rounded-full w-24 h-24"></div>
      <div className="bottom-20 left-1/4 floating-element-fast absolute bg-[#e3f2fd] opacity-50 rounded-full w-16 h-16"></div>

      <h2 className="z-10 relative mb-14 font-semibold text-[#1a2b4a] text-4xl text-center">
        How Med<span className="text-[#00bcd4] heading">Map</span> works
      </h2>
      <div className="z-10 relative gap-10 grid grid-cols-1 md:grid-cols-3 mx-auto px-6 max-w-7xl">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
            className="group bg-white shadow-md hover:shadow-lg p-8 border border-[#bbdefb] rounded-2xl text-center transition-shadow duration-300 cursor-default"
          >
            <div className="flex justify-center items-center mb-4">
              <div className="bg-[#e1f5fe] p-4 rounded-full group-hover:scale-110 transition transform">
                {step.icon}
              </div>
            </div>
            <h3 className="mb-2 font-semibold text-[#1a2b4a] text-xl tracking-wide heading">
              {step.title}
            </h3>
            <p className="text-[#5d8cb3] text-sm leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
