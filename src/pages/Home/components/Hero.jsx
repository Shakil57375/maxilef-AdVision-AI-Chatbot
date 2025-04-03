import { Link } from "react-router-dom";

const Hero = ({ forwardedRef }) => {
  return (
    <section ref={forwardedRef} className="py-10 px-4">
      <div className="container mx-auto text-center">
        <p className="text-2xl text-[#818CF8] my-20">GenAI</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Adfusion Labs:{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#3b82f6]">
            AI-Powered
          </span>
          <br />
          Google Ads Success!
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Our GenAI-powered math tutoring solution delivers personalized,
          evidence-based support to K-12 students, enhancing math learning
          through one-on-one or small group interventions. Built on specialized
          AI models, it adapts to each learner’s needs, driving engagement and
          achievement in core math skills.
        </p>
        <Link to="/" className="bg-[#6366F1] text-white px-40 py-3 rounded-md text-lg font-medium transition-colors relative top-10">
          Let&apos;s Go
        </Link>
      </div>
    </section>
  );
};

export default Hero;
