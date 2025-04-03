import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faq = ({ forwardedRef }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  // FAQ data
  const faqData = [
    {
      question: "How does this AI analyze my Google Ads campaign?",
      answer:
        "The AI reviews your campaign structure, keywords, ad copy, targeting settings, and performance metrics to identify areas for improvement. It looks for inefficiencies, budget misallocations, and missed opportunities to suggest optimizations.",
    },
    {
      question: "What data this AI get in recommendations from?",
      answer:
        "The AI's insights are based on real-world ad performance data, Google’s best practices, and ongoing testing. It also adapts based on industry trends and algorithm updates, which are refreshed every few months to ensure accuracy.",
    },
    {
      question: "How is this different from Google's built-in recommendations?",
      answer:
        "Unlike Google’s suggestions—which often push higher spending—the AI prioritizes ROI and efficiency. It learns from actual campaign performance, fixes issues Google’s recommendations might miss, and provides actionable, unbiased insights tailored to your goals.",
    },
    {
      question: "Does this AI automatically adjust my ads?",
      answer:
        "No, the AI provides clear recommendations, but you have full control over what changes to apply. This ensures that you stay in charge of your budget and strategy, implementing only the suggestions that align with your goals.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. The AI only analyzes your ad account data and does not share or store sensitive information beyond what's necessary for generating insights.",
    },
  ];

  return (
    <section
      ref={forwardedRef}
      className="py-20 px-4 bg-gradient-to-b from-[#0a0b1a] to-[#1a1b2e]"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-[#ff00ff]">
          Frequently asked questions
        </h2>

        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-gray-700 pb-4">
              <button
                className="flex justify-between items-center w-full text-left py-4"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                {openFaq === index ? (
                  <FaChevronUp className="text-[#6366F1]" />
                ) : (
                  <FaChevronDown className="text-[#6366F1]" />
                )}
              </button>
              {openFaq === index && (
                <div className="pb-4 text-gray-300">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
