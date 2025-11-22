import PageBanner from "@/components/shared/PageBanner";
import Testimonials from "@/components/shared/Testimonials";
import AboutUsSection from "./components/AboutUsSection";
import ContactHeroSection from "./components/ContactHeroSection";
import StatsCounterBanner from "./components/StatsCounterBanner";

const AboutPage = () => {
  return (
    <>
      <PageBanner title="About Us" />
      <AboutUsSection />
      <StatsCounterBanner />
      <Testimonials />
      <ContactHeroSection />
    </>
  );
};

export default AboutPage;
