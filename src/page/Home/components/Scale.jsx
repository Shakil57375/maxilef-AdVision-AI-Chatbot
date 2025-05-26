import teamImage1 from "../../../assets/team1.png";
import teamImage2 from "../../../assets/team2.png";
import teamImage3 from "../../../assets/team3.png";
import teamImage4 from "../../../assets/team4.png";
const Scale = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">Let&apos;s Scale</h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 sm:mb-8 text-[#6366F1]">
            Adfusion Labs
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Maximize your advertising ROI with our AI-powered Google Ads optimization platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-300">
              Navigating Google Ads can be overwhelming—budgeting, targeting, and strategy questions pile up fast. Our
              AI chatbot delivers real-time, expert-level guidance to help you optimize campaigns, troubleshoot issues,
              and maximize ROI—24/7. No more guesswork, just clear, data-driven answers when you need them.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 max-w-lg mx-auto lg:max-w-none">
              <div className="space-y-2 sm:space-y-4">
                <img
                  src={teamImage1}
                  alt="Team Image"
                  className="rounded-lg w-full h-36 sm:h-40 lg:h-48 object-cover"
                />
                <img
                  src={teamImage2}
                  alt="Team Image"
                  className="rounded-lg w-full h-36 sm:h-40 lg:h-48 object-cover"
                />
              </div>
              <div className="space-y-2 sm:space-y-4 mt-4 sm:mt-8">
                <img
                  src={teamImage3}
                  alt="Team Image"
                  className="rounded-lg w-full h-36 sm:h-44 lg:h-52 object-cover"
                />
                <img
                  src={teamImage4}
                  alt="Team Image"
                  className="rounded-lg w-full h-36 sm:h-44 lg:h-52 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Scale
