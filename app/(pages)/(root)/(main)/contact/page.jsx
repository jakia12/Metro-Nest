import PageBanner from "@/components/shared/PageBanner";
import ContactInfoSection from "./components/ContactInfoSection";
import ContactSection from "./components/ContactSection";
import LocationMapSection from "./components/LocationMapSection";

const ContactPage = () => {
  return (
    <div>
      <PageBanner title="Contact Us" />
      <ContactInfoSection />
      <ContactSection />
      <LocationMapSection />
    </div>
  );
};

export default ContactPage;
