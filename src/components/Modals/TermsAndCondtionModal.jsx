import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectAccessToken } from "../../features/auth/authSlice";

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();
  const token = useSelector(selectAccessToken); // Get the token from Redux store
  const [content, setContent] = useState(""); // State to store fetched content
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch Terms and Conditions on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://192.168.10.198:5006/api/policy/terms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setContent(response.data.policy.content || "No content available.");
        } else {
          setError("Failed to fetch Terms and Conditions.");
        }
      } catch (err) {
        setError("Error fetching Terms and Conditions: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTerms();
    } else {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
    }
  }, [token]);

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
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsAndConditionsPage;