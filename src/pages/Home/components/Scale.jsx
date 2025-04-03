import teamImage1 from "../../../assets/team1.png";
import teamImage2 from "../../../assets/team2.png";
import teamImage3 from "../../../assets/team3.png";
import teamImage4 from "../../../assets/team4.png";

const Scale = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-20 px-4">
      <div className="container mx-auto">
        <div className="">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
            Let&apos;s Scale
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#6366F1]">
            Adfusion Labs
          </h3>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center mb-16">
            Maximize your advertising ROI with our AI-powered Google Ads
            optimization platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-24">
          <div>
            <p className="text-lg mb-6">
              Navigating Google Ads can be overwhelming—budgeting, targeting,
              and strategy questions pile up fast. Our AI chatbot delivers
              real-time, expert-level guidance to help you optimize campaigns,
              troubleshoot issues, and maximize ROI—24/7. No more guesswork,
              just clear, data-driven answers when you need them.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <img
                src={teamImage1 || "/placeholder.svg"}
                alt="Team Image"
                className="rounded-lg h-[192px] w-[264px] object-cover"
              />
              <img
                src={teamImage2 || "/placeholder.svg"}
                alt="Team Image"
                className="rounded-lg h-[192px] w-[264px] object-cover"
              />
            </div>
            <div>
              <img
                src={teamImage3 || "/placeholder.svg"}
                alt="Team Image"
                className="rounded-lg h-[192px] w-[310px]"
              />
              <img
                src={teamImage4 || "/placeholder.svg"}
                alt="Team Image"
                className="rounded-lg h-[192px] w-[345px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scale;
