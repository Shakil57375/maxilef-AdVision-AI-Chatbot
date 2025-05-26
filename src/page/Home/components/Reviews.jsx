"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const Reviews = ({ forwardedRef }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)

  const reviews = [
    {
      text: "Since using Adfusion Labs' AI-powered platform, my Google Ads campaigns have seen a remarkable improvement. The AI recommendations have truly transformed how I approach advertising.",
      name: "Sarah Jones",
      position: "Marketing Director",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    {
      text: "Adfusion Labs' AI consistently provides strategic insights that have reduced our cost-per-click by 35% while improving conversion rates. Their AI recommendations are spot-on.",
      name: "Mike Brown",
      position: "Small Business Owner",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    {
      text: "Adfusion Labs' AI simplifies Google Ads like no other solution I've tried. As a non-technical marketer, I was impressed at how easy it was to implement their recommendations and see real results.",
      name: "Lisa Chen",
      position: "E-commerce Manager",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    {
      text: "The insights provided by Adfusion Labs have completely changed our advertising strategy. We're now seeing a 40% increase in conversions with the same budget.",
      name: "David Wilson",
      position: "Digital Marketing Specialist",
      avatar: "/placeholder.svg?height=48&width=48",
    },
    {
      text: "As someone who struggled with Google Ads, Adfusion Labs has been a game-changer. Their AI recommendations are clear, actionable, and most importantly, they work!",
      name: "Jennifer Lopez",
      position: "Startup Founder",
      avatar: "/placeholder.svg?height=48&width=48",
    },
  ]

  const updateIndex = useCallback(
    (newIndex) => {
      let index = newIndex
      if (newIndex < 0) {
        index = reviews.length - 1
      } else if (newIndex >= reviews.length) {
        index = 0
      }
      setActiveIndex(index)
    },
    [reviews.length],
  )

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = () => {
      if (!isPaused) {
        updateIndex(activeIndex + 1)
      }
    }
  }, [activeIndex, isPaused, updateIndex])

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        autoPlayRef.current()
      }
    }, 5000)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [])

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      updateIndex(activeIndex + 1)
    }
    if (isRightSwipe) {
      updateIndex(activeIndex - 1)
    }
  }

  // Handle mouse events to pause/resume autoplay
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section ref={forwardedRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center text-white">
          Our <span className="text-purple-500">Reviews</span>
        </h2>

        <div className="relative max-w-4xl mx-auto" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2 sm:px-4">
                  <div className="bg-slate-800 p-4 sm:p-6 lg:p-8 rounded-lg shadow-xl border border-slate-700">
                    {/* Star rating */}
                    <div className="flex mb-4 justify-center sm:justify-start">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current mr-1" />
                      ))}
                    </div>

                    {/* Review text */}
                    <blockquote className="text-slate-300 mb-6 text-sm sm:text-base lg:text-lg italic leading-relaxed text-center sm:text-left">
                      "{review.text}"
                    </blockquote>

                    {/* Author info */}
                    <div className="flex items-center justify-center sm:justify-start">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 border-2 border-purple-500 object-cover"
                      />
                      <div className="text-center sm:text-left">
                        <p className="font-semibold text-white text-sm sm:text-base">{review.name}</p>
                        <p className="text-xs sm:text-sm text-slate-400">{review.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons - Hidden on very small screens */}
          <button
            onClick={() => updateIndex(activeIndex - 1)}
            className="absolute left-2 sm:left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 border border-purple-500 text-white rounded-full p-2 lg:p-3 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center z-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>

          <button
            onClick={() => updateIndex(activeIndex + 1)}
            className="absolute right-2 sm:right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 border border-purple-500 text-white rounded-full p-2 lg:p-3 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center z-10 focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>

          {/* Mobile navigation buttons */}
          <div className="flex justify-between mt-4 sm:hidden gap-4">
            <button
              onClick={() => updateIndex(activeIndex - 1)}
              className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 border border-purple-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={() => updateIndex(activeIndex + 1)}
              className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 border border-purple-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => updateIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                activeIndex === index ? "bg-purple-500 scale-125" : "bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe instruction for mobile */}
        <p className="text-center text-slate-400 text-xs mt-4 sm:hidden">Swipe left or right to navigate reviews</p>
      </div>
    </section>
  )
}

export default Reviews
