import Hero from "../Ui/Hero";
import ForUsers from "../Ui/forUsers";
import Footer from "../Ui/Footer";
import HowItWorks from "../Ui/howItWorks";
import Navbar from "../Ui/Navbar";

const Landing = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ForUsers />
      <Footer />
    </div>
  );
};

export default Landing;
