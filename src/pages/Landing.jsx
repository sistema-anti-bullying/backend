import HeroSection from "../components/landing/HeroSection";
import BullyingTypesSection from "../components/landing/BullyingTypesSection";
import AboutSection from "../components/landing/AboutSection";
import FAQSection from "../components/landing/FAQSection";

export default function Landing() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <BullyingTypesSection />
      <FAQSection />
    </div>
  );
}