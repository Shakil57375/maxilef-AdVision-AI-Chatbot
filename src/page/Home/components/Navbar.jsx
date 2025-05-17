import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = ({ scrollToSection, refs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState("home");

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    // Prevent body scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  // Close menu when a navigation item is clicked
  const handleNavClick = (ref, section) => {
    scrollToSection(ref);
    setActiveSection(section);
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  // Track scroll position for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);

      // Determine active section based on scroll position
      // This is a simplified version - you might want to implement a more sophisticated approach
      const sections = [
        { id: "home", ref: refs.heroRef },
        { id: "scale", ref: refs.scaleRef },
        { id: "whyUs", ref: refs.whyUsRef },
        { id: "howItWorks", ref: refs.howItWorksRef },
        { id: "about", ref: refs.aboutUsRef },
        { id: "reviews", ref: refs.reviewsRef },
        { id: "pricing", ref: refs.pricingRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [refs]);

  // Clean up body overflow style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Navigation items array for DRY code
  const navItems = [
    { id: "home", name: "Home", ref: refs.heroRef },
    { id: "scale", name: "Scale", ref: refs.scaleRef },
    { id: "whyUs", name: "Why Us", ref: refs.whyUsRef },
    { id: "howItWorks", name: "How it Works", ref: refs.howItWorksRef },
    { id: "about", name: "About", ref: refs.aboutUsRef },
    { id: "reviews", name: "Reviews", ref: refs.reviewsRef },
    { id: "pricing", name: "Pricing", ref: refs.pricingRef },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollPosition > 10 || isMenuOpen
            ? "bg-[#0a0b1a]/95 backdrop-blur-sm shadow-lg"
            : "bg-[#0a0b1a]/70 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src={logo || "/placeholder.svg"}
                alt="Adfusion Labs Logo"
                className="h-10"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.ref, item.id)}
                  className={`relative text-white hover:text-[#a855f7] transition-colors ${
                    activeSection === item.id ? "text-[#a855f7]" : ""
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#a855f7] rounded-full"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={"/login"}
                className="text-white hover:text-[#a855f7] transition-colors"
              >
                Log In
              </Link>
              <Link
                to={"/signUp"}
                className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 focus:outline-none z-50"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
        aria-hidden="true"
      ></div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-[#0a0b1a] z-50 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden pt-20 overflow-y-auto shadow-xl`}
      >
        <div className="px-6 py-6">
          <div className="flex flex-col space-y-1">
            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.ref, item.id)}
                className={`text-left text-white hover:bg-[#1a1b2e] transition-colors py-4 px-4 rounded-lg text-lg ${
                  activeSection === item.id ? "bg-[#1a1b2e] text-[#a855f7]" : ""
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-3 pt-6 mt-4 border-t border-gray-800">
              <Link
                to={"/login"}
                className="text-white hover:bg-[#1a1b2e] transition-colors py-4 px-4 rounded-lg text-lg"
              >
                Log In
              </Link>
              <Link
                to={"/register"}
                className="bg-[#a855f7] hover:bg-[#9333ea] text-white py-4 px-4 rounded-lg transition-colors text-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
