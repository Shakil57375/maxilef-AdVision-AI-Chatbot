import { ScrollProvider, useScroll } from "./context/ScrollContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Scale from "./components/Scale.jsx";
import WhyUs from "./components/WhyUs.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Reviews from "./components/Reviews.jsx";
import Faq from "./components/Faq.jsx";
import Pricing from "./components/Pricing.jsx";
import Footer from "./components/Footer.jsx";

const AppContent = () => {
  const { refs, scrollToSection } = useScroll();

  return (
    <div className="font-sans bg-[#0a0b1a] text-white min-h-screen">
      <Navbar scrollToSection={scrollToSection} refs={refs} />
      <Hero forwardedRef={refs.heroRef}  />
      <Scale forwardedRef={refs.scaleRef} />
      <WhyUs forwardedRef={refs.whyUsRef} />
      <HowItWorks forwardedRef={refs.howItWorksRef} />
      <AboutUs forwardedRef={refs.aboutUsRef} />
      <Reviews forwardedRef={refs.reviewsRef} />
      <Faq forwardedRef={refs.faqRef} />
      <Pricing forwardedRef={refs.pricingRef} />
      <Footer scrollToSection={scrollToSection} refs={refs} />
    </div>
  );
};

export default AppContent;
