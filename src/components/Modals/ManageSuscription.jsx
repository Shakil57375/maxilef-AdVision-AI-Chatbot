import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../../features/auth/authApi";
import { useCancelSubscriptionMutation } from "../../features/subscription/subscriptionApi";
import toast from "react-hot-toast";

export default function SubscriptionDetailsPage() {
  const navigate = useNavigate();

  // Fetch user profile and subscription info
  const {
    data: subscriptionInfo,
    isLoading: isProfileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery();

  // Cancel subscription mutation
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription().unwrap();
      toast.success(
        response?.Message || "Subscription cancelled successfully.",
        { duration: 1000 }
      );
      refetchUserProfile(); // Refresh user profile to reflect subscription status
      navigate(-1); // Navigate back after successful cancellation
    } catch (error) {
      console.error("Cancel subscription error:", error);
      toast.error("Failed to cancel subscription. Please try again.", {
        duration: 1000,
      });
    }
  };

  // Close modal
  const onClose = () => {
    navigate(-1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get subscription price
  const getSubscriptionPrice = () => {
    if (!subscriptionInfo) return "N/A";

    if (subscriptionInfo.package_name === "yearly") {
      return "$8.30/month";
    } else if (subscriptionInfo.package_name === "monthly") {
      return "$12.99/month";
    } else {
      return "N/A";
    }
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
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl mx-4 dark:bg-gray-700 dark:text-white"
        >
          {/* Header with close button */}
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

          {/* Plan Type Section */}
          <div className="mb-4">
            <p className="text-white mb-2">Plan Type</p>
            <div className="border border-blue-500 rounded-lg p-4 bg-[#212121]">
              <p className="text-white text-lg">
                {isProfileLoading
                  ? "Loading..."
                  : subscriptionInfo?.subscription_status === "subscribed"
                  ? subscriptionInfo?.package_name === "yearly"
                    ? "Standard (Yearly)"
                    : "Standard (Monthly)"
                  : "No Active Plan"}
              </p>
            </div>
          </div>

          {/* Subscription Details Section */}
          {subscriptionInfo?.subscription_status === "not_subscribed" ? (
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
                    {formatDate(subscriptionInfo?.subscription_started_on)}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-white">Subscription Expiry Date:</p>
                  <p className="text-gray-300">
                    {formatDate(subscriptionInfo?.subscription_expires_on)}
                  </p>
                </div>

                <div className="flex flex-col">
                  <p className="text-white">Subscription Price:</p>
                  <p className="text-gray-300">{getSubscriptionPrice()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {subscriptionInfo?.subscription_status === "subscribed" && (
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="py-2 px-6 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                {isCancelling ? "Cancelling..." : "Cancel"}
              </button>

              <button
                onClick={() => navigate("/upgrade")}
                className="py-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
