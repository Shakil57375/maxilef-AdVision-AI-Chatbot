import { useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { IoMdClose } from "react-icons/io"
import { FaCheck, FaTimes } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useUpgradePlanMutation } from "../features/subscription/subscriptionApi"

export function UpgradePage() {
  const [upgradePlan] = useUpgradePlanMutation()
  const [loadingPlanId, setLoadingPlanId] = useState(null)
  const navigate = useNavigate()

  const handleUpgrade = async (plan) => {
    if (plan === "free") {
      // If it's the free plan, just show a message
      toast.success("You are already using the free plan", { duration: 1000 })
      return
    }

    setLoadingPlanId(plan)
    try {
      const response = await upgradePlan({ subscription_plan: plan }).unwrap()
      if (response?.checkout_url) {
        window.location.href = response.checkout_url
      } else {
        toast.error(response?.Message || "Upgrade failed. Please try again.", { duration: 1000 })
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      toast.error("Failed to upgrade. Please try again.", { duration: 1000 })
    } finally {
      setLoadingPlanId(null)
    }
  }

  const onClose = () => {
    navigate(-1)
  }

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
      id: "one", // Corresponds to "subscription_plan": "one"
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
      id: "two", // Corresponds to "subscription_plan": "two"
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
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500">Subscriptions Plan</h1>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-400">
            <IoMdClose className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg overflow-hidden ${
                plan.isPopular ? "border-blue-500 bg-blue-600" : "border-blue-500 bg-[#212121]"
              }`}
            >
              {plan.isPopular && (
                <div className="bg-blue-600 text-white py-2 px-4 text-center">
                  <span className="font-bold">Most Popular</span>
                </div>
              )}

              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.isPopular ? "text-white" : "text-white"}`}>
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
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loadingPlanId === plan.id}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.id === "free" ? "bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {loadingPlanId === plan.id ? "Processing..." : plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default UpgradePage

