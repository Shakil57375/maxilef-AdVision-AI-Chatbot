import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl mx-4 dark:bg-gray-700 dark:text-white"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-blue-500">
              Terms & Conditions
            </h1>
            <button
              onClick={closeModal}
              className="text-blue-500 hover:text-blue-400"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-white h-[calc(100vh-300px)] overflow-y-scroll">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Adfusion Labs Google Ads AI Chatbot - Terms and Conditions
              </h2>
              <p className="mb-2">Effective Date: 3/22/2025</p>
              <p className="mb-4">
                Welcome to Adfusion Labs’ Google Ads AI Chatbot ("the
                Chatbot"). By using this Chatbot, you agree to the following
                Terms and Conditions. If you do not agree, please do not use the
                Chatbot.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p className="mb-4">
                By accessing or using the Chatbot, you agree to be bound by
                these Terms. Adfusion Labs reserves the right to update, modify,
                or discontinue the Chatbot at any time without prior notice.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                2. Ownership & Intellectual Property
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Chatbot, including but not limited to its algorithms,
                  responses, and underlying technology, is the exclusive
                  property of Adfusion Labs.
                </li>
                <li>
                  Unauthorized copying, distribution, modification, reverse
                  engineering, or resale of the Chatbot or its functionalities
                  is strictly prohibited.
                </li>
                <li>
                  All trademarks, service marks, and logos related to the
                  Chatbot belong to Adfusion Labs.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. Permitted Use</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Chatbot is intended for lawful use in managing and
                  optimizing Google Ads campaigns.
                </li>
                <li>
                  Users must not misuse the Chatbot in a way that violates
                  Google’s policies or any applicable laws.
                </li>
                <li>
                  The Chatbot is provided on an “as-is” basis, and Adfusion Labs
                  does not guarantee specific performance outcomes.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">4. Restrictions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  You may not use the Chatbot for any unlawful, fraudulent, or
                  deceptive activities.
                </li>
                <li>
                  Attempts to gain access to, disable, or interfere with the
                  Chatbot or any of its components, including servers,
                  databases, or systems, will violate the Chatbot’s security
                  features.
                </li>
                <li>
                  Users must not generate spam, misleading ads, or content that
                  violates Google’s policies through the Chatbot.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                5. Disclaimer & Limitation of Liability
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Adfusion Labs is not responsible for any performance,
                  penalties, or account restrictions resulting from the use of
                  the Chatbot.
                </li>
                <li>
                  The Chatbot is an AI tool and does not replace professional
                  advertising or legal advice. Users assume all risk associated
                  with its use.
                </li>
                <li>
                  Adfusion Labs will not be liable for any direct, indirect,
                  incidental, or consequential damages arising from the use or
                  inability to use the Chatbot.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                6. Data Privacy & Compliance
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Chatbot does not store or process sensitive user data
                  beyond what is necessary for its functionality.
                </li>
                <li>
                  Users are responsible for ensuring compliance with Google Ads
                  policies and any applicable data protection laws.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
              <p className="mb-4">
                Adfusion Labs reserves the right to restrict, suspend, or
                terminate access to the Chatbot at any time for violation of
                these Terms or for any other reason deemed necessary.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed under the laws of
                the State of [Your State], without regard to its conflict of law
                principles.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                9. Contact Information
              </h2>
              <p className="mb-4">
                For any questions about these Terms, please contact Adfusion
                Labs at maxme@adfusionlabs.ai
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditionsPage;
