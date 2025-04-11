import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import WholeWebsiteLoader from "../components/Loader/WholeWebsiteLoader";
import {
  useCreateStripeSessionMutation,
  useGetActivePackagesQuery,
  useGetSubscriptionDetailsQuery,
} from "../features/subscription/subscriptionApi";

export function UpgradePage() {
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const navigate = useNavigate();
  const { data: subscriptionInfo } = useGetSubscriptionDetailsQuery();
  console.log(subscriptionInfo);
  // Check if the user is already subscribed

  // Fetch active packages to get packId
  const {
    data: packagesData,
    isLoading,
    isError,
    error,
  } = useGetActivePackagesQuery();

  // Mutation to create a Stripe session
  const [createStripeSession] = useCreateStripeSessionMutation();

  const onClose = () => {
    navigate(-1);
  };

  if (
    subscriptionInfo?.success &&
    subscriptionInfo?.subscription?.trialActive
  ) { 
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Already Subscribed
          </h1>
          <p className="mb-6">You are already subscribed to a plan.</p>
          <Link
            to="/manageSubscription"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Manage your subscription
          </Link>
        </div>
      </div>
    );
  }

  // Handle the "Buy Now" button click
  const handleBuyNow = async (packId) => {
    setLoadingPlanId(packId);
    try {
      const response = await createStripeSession(packId).unwrap();
      if (response.success && response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        toast.error("Failed to create Stripe session. Please try again.", {
          duration: 2000,
        });
      }
    } catch (err) {
      console.error("Error creating Stripe session:", err);
      toast.error("Failed to create Stripe session. Please try again.", {
        duration: 2000,
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Extract packId for monthly and yearly plans from the API response
  const monthlyPackId = packagesData?.packages?.find(
    (pkg) => pkg.subscriptionType === "Monthly"
  )?.packId;
  const yearlyPackId = packagesData?.packages?.find(
    (pkg) => pkg.subscriptionType === "Yearly"
  )?.packId;

  // Static plans data with dynamically assigned packId
  const plans = [
    {
      id: "free",
      name: "Free plan",
      price: "$0",
      period: "/ 30 Days",
      subtext: "per user/month, billed annually",
      buttonText: "Already using",
      isPopular: false,
      forText: "For Scaling Businesses",
      features: [
        { text: "Ask up to 3 questions per month", included: true },
        { text: "Get AI-generated answers", included: true },
        { text: "No photo uploads", included: false },
        { text: "No unlimited access", included: false },
      ],
    },
    {
      id: monthlyPackId || "one", // Use fetched packId, fallback to "one"
      name: "Standard Plan",
      price: "$14.44",
      period: "/ Month",
      subtext: "per user/month, billed annually",
      buttonText: "Buy Now",
      isPopular: true,
      forText: "For Scaling Businesses",
      features: [
        { text: "Unlimited questions & answers", included: true },
        { text: "Upload photos for AI analysis", included: true },
        { text: "Priority support", included: true },
      ],
    },
    {
      id: yearlyPackId || "two", // Use fetched packId, fallback to "two"
      name: "Premium Plan",
      price: "$0",
      period: "/ 30 Days",
      subtext: "$144.44 / Year (Save $28.84)",
      buttonText: "Buy Now",
      isPopular: false,
      forText: "For Scaling Businesses",
      features: [
        { text: "Everything in the Standard Plan", included: true },
        { text: "Best value – save on yearly billing", included: true },
        { text: "Exclusive updates & priority features", included: true },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <WholeWebsiteLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Plans
          </h1>
          <p>
            {error?.data?.message ||
              "An error occurred while fetching subscription plans."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500">
            Subscriptions Plan
          </h1>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-blue-400"
          >
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg overflow-hidden ${
                plan.isPopular
                  ? "border-blue-500 bg-blue-600"
                  : "border-blue-500 bg-[#212121]"
              }`}
            >
              {plan.isPopular && (
                <div className="bg-blue-600 text-white py-2 px-4 text-center">
                  <span className="font-bold">Most Popular</span>
                </div>
              )}

              <div className="p-6">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    plan.isPopular ? "text-white" : "text-white"
                  }`}
                >
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-xl ml-1">{plan.period}</span>
                </div>

                <p className="text-sm text-gray-300 mb-4">{plan.subtext}</p>

                <p className="text-sm mb-4">{plan.forText}</p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      {feature.included ? (
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      ) : (
                        <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                      )}
                      <span className="text-sm">{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.id === "free") return; // Do nothing for free plan
                    handleBuyNow(plan.id);
                  }}
                  disabled={loadingPlanId === plan.id}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.id === "free"
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 bg-white"
                  } ${
                    loadingPlanId === plan.id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loadingPlanId === plan.id
                    ? "Processing..."
                    : plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default UpgradePage;
