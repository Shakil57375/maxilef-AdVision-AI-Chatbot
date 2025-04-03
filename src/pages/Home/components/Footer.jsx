import logo from "../../../assets/logo.png";

const Footer = ({ scrollToSection, refs }) => {
  return (
    <footer className="bg-[#0a0b1a] py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img
              src={logo || "/placeholder.svg"}
              alt="Adfusion Labs Logo"
              className="h-10"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <button
              onClick={() => scrollToSection(refs.heroRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection(refs.scaleRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              Scale
            </button>
            <button
              onClick={() => scrollToSection(refs.whyUsRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection(refs.howItWorksRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection(refs.aboutUsRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection(refs.pricingRef)}
              className="text-gray-300 hover:text-[#6366F1] transition-colors"
            >
              Pricing
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Adfusion Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
