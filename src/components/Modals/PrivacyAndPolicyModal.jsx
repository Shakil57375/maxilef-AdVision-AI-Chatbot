import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage = () => {
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
            <h1 className="text-2xl font-bold text-blue-500">Privacy Policy</h1>
            <button
              onClick={closeModal}
              className="text-blue-500 hover:text-blue-400"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 text-white h-[calc(100vh-300px)] overflow-y-scroll">
            <div>
              <p className="mb-2 font-medium">Effective Date: 3/22/2025</p>
              <p className="mb-4">
                Adfusion Labs ("we," "us," or "our") values your privacy. This
                Privacy Policy explains how we collect, use, and protect
                information when you use our Google Ads AI Chatbot ("the
                Chatbot"). By using the Chatbot, you agree to the terms outlined
                below.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                1. Information We Collect
              </h2>
              <p className="mb-2">When using the Chatbot, we may collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>User Input Data:</strong> Any text, queries, or
                  information you enter while interacting with the Chatbot.
                </li>
                <li>
                  <strong>Technical Data:</strong> Browser type, IP address,
                  device type, and usage analytics.
                </li>
                <li>
                  <strong>Google Ads-Related Data:</strong> Non-sensitive data
                  related to Google Ads performance, campaign insights, and
                  optimization suggestions.
                </li>
              </ul>
              <p className="mt-2">
                We do not collect sensitive personal information such as payment
                details, passwords, or confidential business data beyond what is
                necessary for the Chatbot’s functionality.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                2. How We Use Your Information
              </h2>
              <p className="mb-2">We may use the information collected to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Improve and optimize the Chatbot’s performance.</li>
                <li>
                  Provide relevant insights and suggestions for your Google Ads
                  campaigns.
                </li>
                <li>Analyze general usage trends to enhance our services.</li>
                <li>
                  Ensure compliance with applicable policies and security
                  measures.
                </li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or share your information with third
                parties for marketing purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
              <p className="mb-4">
                We implement reasonable security measures to protect your data
                from unauthorized access, misuse, or disclosure. However, no
                data transmission over the internet can be guaranteed as 100%
                secure. Users assume any risks associated with using the
                Chatbot.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                4. Third-Party Services
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The Chatbot may interact with Google Ads APIs and other
                  third-party tools. Any data shared with those services is
                  subject to their respective privacy policies.
                </li>
                <li>
                  We are not responsible for how Google or any third-party
                  service processes your data.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                5. Cookies & Tracking Technologies
              </h2>
              <p className="mb-4">
                We may use cookies or similar tracking technologies to improve
                the Chatbot experience. Users can adjust browser settings to
                block cookies, but this may impact functionality.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                6. User Rights & Choices
              </h2>
              <p className="mb-2">
                Depending on your location, you may have rights regarding your
                data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to request access to the data we collect.</li>
                <li>
                  The right to request deletion of your data (where applicable).
                </li>
                <li>
                  The right to opt-out of certain data collection practices.
                </li>
              </ul>
              <p className="mt-2">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:maxime@adfusionlabs.ai"
                  className="text-blue-400 underline"
                >
                  maxime@adfusionlabs.ai
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                7. Children’s Privacy
              </h2>
              <p className="mb-4">
                The Chatbot is not intended for users under the age of 13. We do
                not knowingly collect data from children.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                8. Changes to This Privacy Policy
              </h2>
              <p className="mb-4">
                We may update this policy periodically. Any changes will be
                posted with an updated "Effective Date". Continued use of the
                Chatbot after updates constitutes acceptance of the revised
                policy.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">
                9. Contact Information
              </h2>
              <p className="mb-4">
                For privacy-related inquiries, contact Adfusion Labs at{" "}
                <a
                  href="mailto:maxime@adfusionlabs.ai"
                  className="text-blue-400 underline"
                >
                  maxime@adfusionlabs.ai
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
