import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../../features/auth/authApi";
import {
  useCancelSubscriptionMutation,
  useGetSubscriptionDetailsQuery,
} from "../../features/subscription/subscriptionApi";
import toast from "react-hot-toast";

export default function SubscriptionDetailsPage() {
  const navigate = useNavigate();

  const { data } = useGetSubscriptionDetailsQuery();
  console.log(data?.subscription);
  const subscriptionInfo = data?.subscription || null;

  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const handleCancelSubscription = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel your subscription? This action cannot be undone."
    );
    if (!confirmCancel) return;

    try {
      const response = await cancelSubscription().unwrap();
      toast.success(
        response?.Message || "Subscription cancelled successfully.",
        { duration: 2000 }
      );
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Cancel subscription error:", error);
      const errorMessage =
        error?.data?.Message ||
        "Failed to cancel subscription. Please try again.";
      toast.error(errorMessage, { duration: 2000 });
    }
  };

  const onClose = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8 flex items-start justify-center">
      <motion.div
        className="w-full max-w-2xl bg-[#1a1a1a] rounded-2xl relative"
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
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl lg:mx-4 mx-0 dark:bg-gray-700 dark:text-white"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-blue-500">
              Subscriptions Plan
            </h1>
            <button
              onClick={onClose}
              className="text-blue-500 hover:text-blue-400"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-white mb-2">Plan Type</p>
            <div className="border border-blue-500 rounded-lg p-4 bg-[#212121]">
              <p className="text-white text-lg">
                {subscriptionInfo?.type || "N/A"}
              </p>
            </div>
          </div>

          {subscriptionInfo?.trialActive !== true ? (
            <div className="border border-blue-500 rounded-lg p-6 mb-6 bg-[#212121]">
              <Link
                to="/upgrade"
                className="text-blue-500 hover:text-blue-400 underline block text-center"
              >
                Please Subscribe to a Plan
              </Link>
            </div>
          ) : (
            <div className="border border-blue-500 rounded-lg p-6 mb-6 bg-[#212121]">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <p className="text-white">Subscription Effective Date:</p>
                  <p className="text-gray-300">
                    {formatDate(subscriptionInfo?.begins)}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-white">Subscription Expiry Date:</p>
                  <p className="text-gray-300">
                    {formatDate(subscriptionInfo?.ends)}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-white">Subscription Price:</p>
                  <p className="text-gray-300">
                    {subscriptionInfo?.amount || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

            <div className="flex justify-between space-x-4 mt-8">
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className={`py-2 px-6 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 bg-red-500 ${
                  isCancelling ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCancelling ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    <span >Cancelling...</span>
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </button>

              <button
                onClick={() => navigate("/upgrade")}
                className="py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Subscription
              </button>
            </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
