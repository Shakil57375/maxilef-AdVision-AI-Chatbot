import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiX, FiCheck } from "react-icons/fi"
import { useGetSubscriptionPlansQuery, useSubscribeToPlanMutation } from "../../features/subscriptions/subscriptionApi"

const SubscriptionsPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const { data: plans, isLoading } = useGetSubscriptionPlansQuery()
  const [subscribeToPlan, { isLoading: isSubscribing }] = useSubscribeToPlanMutation()

  const navigate = useNavigate()

  // Handle subscription
  const handleSubscribe = async (planId) => {
    setSelectedPlan(planId)

    try {
      // Call subscribeToPlan mutation from RTK Query
      await subscribeToPlan(planId).unwrap()

      // Redirect to chat page after successful subscription
      navigate("/")
    } catch (error) {
      console.error("Failed to subscribe:", error)
      // You could set an error state here
    }
  }

  // Handle close modal
  const handleClose = () => {
    navigate("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
        <div className="text-white">Loading subscription plans...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-[#1a1b2e] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-[#0066ff] text-center mb-8">Subscriptions Plan</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans &&
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 relative ${
                    plan.popular ? "border-[#0066ff] bg-[#0066ff]/5" : "border-gray-700 bg-[#0a0b1a]"
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-[#0066ff] text-white text-center py-1 px-4 rounded-t-lg absolute top-0 left-0 right-0 transform -translate-y-full">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-xl text-gray-400 ml-1">/ {plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                  <p className="text-gray-300 mb-4">For Scaling Businesses</p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        ) : (
                          <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                        )}
                        <span className="text-gray-300 text-sm">{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isSubscribing && selectedPlan === plan.id}
                    className={`w-full py-3 rounded-md font-medium ${
                      plan.popular
                        ? "bg-[#0066ff] text-white hover:bg-blue-600"
                        : "bg-[#2d2e3f] text-white hover:bg-[#3d3e4f]"
                    } transition-colors disabled:opacity-50`}
                  >
                    {isSubscribing && selectedPlan === plan.id
                      ? "Processing..."
                      : plan.id === "free"
                        ? "Already using"
                        : "Buy Now"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsPage

// BACKEND INTEGRATION NOTES:
// 1. Replace the RTK Query hooks with your actual backend endpoints
// 2. Implement payment processing integration (Stripe, PayPal, etc.)
// 3. Add proper error handling for subscription failures
// 4. Consider adding a confirmation step before subscribing
// 5. Add analytics tracking for subscription events

