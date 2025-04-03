import { useState, useEffect, useRef } from "react"
import { BsStarFill } from "react-icons/bs"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import userThumb1 from "../../../assets/user-thumb1.png"
import userThumb2 from "../../../assets/user-thumb2.png"
import userThumb3 from "../../../assets/user-thumb3.png"

const Reviews = ({ forwardedRef }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)

  const reviews = [
    {
      text: "Since using Adfusion Labs' AI-powered platform, my Google Ads campaigns have seen a remarkable improvement. The AI recommendations have truly transformed how I approach advertising.",
      name: "Sarah Jones",
      position: "Marketing Director",
      avatar: userThumb1,
    },
    {
      text: "Adfusion Labs' AI consistently provides strategic insights that have reduced our cost-per-click by 35% while improving conversion rates. Their AI recommendations are spot-on.",
      name: "Mike Brown",
      position: "Small Business Owner",
      avatar: userThumb2,
    },
    {
      text: "Adfusion Labs' AI simplifies Google Ads like no other solution I've tried. As a non-technical marketer, I was impressed at how easy it was to implement their recommendations and see real results.",
      name: "Lisa Chen",
      position: "E-commerce Manager",
      avatar: userThumb3,
    },
    {
      text: "The insights provided by Adfusion Labs have completely changed our advertising strategy. We're now seeing a 40% increase in conversions with the same budget.",
      name: "David Wilson",
      position: "Digital Marketing Specialist",
      avatar: userThumb1,
    },
    {
      text: "As someone who struggled with Google Ads, Adfusion Labs has been a game-changer. Their AI recommendations are clear, actionable, and most importantly, they work!",
      name: "Jennifer Lopez",
      position: "Startup Founder",
      avatar: userThumb2,
    },
  ]

  const updateIndex = (newIndex) => {
    let index = newIndex
    if (newIndex < 0) {
      index = reviews.length - 1
    } else if (newIndex >= reviews.length) {
      index = 0
    }
    setActiveIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    autoPlayRef.current = () => {
      if (!isPaused) {
        updateIndex(activeIndex + 1)
      }
    }
  }, [activeIndex, isPaused])

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

  // Handle mouse events to pause/resume autoplay
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section ref={forwardedRef} className="py-20 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Our <span className="text-[#a855f7]">Review</span>
        </h2>

        <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Carousel container */}
          <div ref={carouselRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4 md:px-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-[#1a1b2e] p-6 md:p-8 rounded-lg shadow-lg">
                      <div className="flex mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <BsStarFill key={star} className="text-yellow-400 mr-1" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-6 text-lg md:text-xl italic">"{review.text}"</p>
                      <div className="flex items-center">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          className="w-12 h-12 rounded-full mr-4 border-2 border-[#a855f7]"
                        />
                        <div>
                          <p className="font-medium text-lg">{review.name}</p>
                          <p className="text-sm text-gray-400">{review.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={() => {
              updateIndex(activeIndex - 1)
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full p-3 shadow-lg transition-colors z-10 md:-left-5"
            aria-label="Previous review"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              updateIndex(activeIndex + 1)
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full p-3 shadow-lg transition-colors z-10 md:-right-5"
            aria-label="Next review"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-3">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                updateIndex(index)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index ? "bg-[#a855f7] scale-125" : "bg-gray-500 hover:bg-gray-400"
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Reviews

