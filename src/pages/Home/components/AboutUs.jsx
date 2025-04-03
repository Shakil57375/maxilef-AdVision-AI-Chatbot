import aboutUsImage from "../../../assets/about-us.png";

const AboutUs = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="text-gray-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              About <span className="text-[#6366F1]">Us</span>
            </h2>
            <p className="mb-4">
              I&apos;m Morris, founder of Adfusion Labs. With over five years of
              experience in Google Ads, I&apos;ve seen how AI can revolutionize
              digital marketing. After spending countless hours manually
              responding to ad-hoc requests, I knew there had to be a better
              way.
            </p>
            <p className="mb-4">
              That&apos;s why I built this tool for advertisers who want
              personalized guidance without the high costs of traditional
              agencies. Our AI is powered by financial research and real-world
              experience with Google Ads, giving you the competitive edge.
            </p>
            <p>
              We&apos;re committed to helping small businesses and startups
              overcome the overwhelming hurdles that paid advertising so often
              of creates. Our goal is to help level the playing field.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src={aboutUsImage || "/placeholder.svg"}
              alt="About Us"
              className="max-w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
