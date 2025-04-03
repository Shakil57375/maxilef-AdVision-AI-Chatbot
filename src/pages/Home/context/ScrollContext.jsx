import { createContext, useContext, useRef } from "react"

// Create context
const ScrollContext = createContext()

// Create provider
export const ScrollProvider = ({ children }) => {
  // Create refs for each section
  const heroRef = useRef(null)
  const scaleRef = useRef(null)
  const whyUsRef = useRef(null)
  const howItWorksRef = useRef(null)
  const aboutUsRef = useRef(null)
  const reviewsRef = useRef(null)
  const faqRef = useRef(null)
  const pricingRef = useRef(null)

  // Smooth scroll function
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  // Refs object to pass to components
  const refs = {
    heroRef,
    scaleRef,
    whyUsRef,
    howItWorksRef,
    aboutUsRef,
    reviewsRef,
    faqRef,
    pricingRef,
  }

  return <ScrollContext.Provider value={{ refs, scrollToSection }}>{children}</ScrollContext.Provider>
}

// Custom hook to use the scroll context
export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}

