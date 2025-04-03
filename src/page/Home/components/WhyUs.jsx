import laptopImage from "../../../assets/laptop.png";

const WhyUs = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div>
            <img
              src={laptopImage || "/placeholder.svg"}
              alt="Laptop with Adfusion Labs"
              className=" w-full h-full lg:w-[594px] lg:h-[616px] rounded-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-20 ">
              Why you use <span className="text-[#6366F1]">Our ai</span>
            </h2>
            <ul className="space-y-10">
              <li className="flex items-start">
                <span className="text-[#6366F1] mr-3 mt-1 text-4xl">•</span>
                <span className="text-4xl">
                Instant Answers to Google Ads Questions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#6366F1] mr-3 mt-1 text-4xl">•</span>
                <span className="text-4xl">AI-Driven Optimization Tips</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#6366F1] mr-3 mt-1 text-4xl">•</span>
                <span className="text-4xl">
                  24/7 Support for Budget & Bidding Issues
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#6366F1] mr-3 mt-1 text-4xl">•</span>
                <span className="text-4xl">
                  Simplified Campaign Troubleshooting
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
