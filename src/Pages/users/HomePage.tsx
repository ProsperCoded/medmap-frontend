import HowItWorks from "../../Ui/howItWorks";
import ForUsers from "../../Ui/forUsers";
import Footer from "../../Ui/Footer";
import Hero from "../../Ui/Hero";
import Navbar from "../../Ui/Navbar";

const HomePage = () => {
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

export default HomePage;
