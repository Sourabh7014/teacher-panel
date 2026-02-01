import Navbar from "./navbar";
import HeroSection from "./hero-section";
import ServicesSection from "./services-section";
import HowItWorksSection from "./how-it-works-section";
import AboutSection from "./about-section";
import Footer from "./footer";

export function SiteMain() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <AboutSection />
      <Footer />
    </main>
  );
}
