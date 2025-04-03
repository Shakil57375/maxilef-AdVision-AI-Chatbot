import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiX } from "react-icons/fi"
import {
  useGetUserSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
} from "../../features/subscriptions/subscriptionApi"

const ManageSubscriptionPage = () => {
  const { data: subscription, isLoading } = useGetUserSubscriptionQuery()
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation()
  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation()

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const navigate = useNavigate()

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle close modal
  const handleClose = () => {
    navigate("/")
  }

  // Handle update subscription
  const handleUpdate = async () => {
    try {
      // In a real implementation, you would collect updated subscription details
      await updateSubscription({
        autoRenew: !subscription?.autoRenew,
      }).unwrap()

      // Success message or redirect
    } catch (error) {
      console.error("Failed to update subscription:", error)
    }
  }

  // Handle cancel subscription
  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap()
      setShowCancelConfirm(false)
      // Redirect or show success message
      navigate("/")
    } catch (error) {
      console.error("Failed to cancel subscription:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
        <div className="text-white">Loading subscription details...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1a1b2e] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-[#0066ff] text-center mb-8">Subscriptions Plan</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Plan Type</label>
              <div className="w-full bg-[#0a0b1a] border border-gray-700 rounded-md p-4 text-white">
                {subscription?.planName || "Standard"}
              </div>
            </div>

            <div className="border border-[#0066ff] rounded-md p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-300">Subscription Effective Date:</p>
                  <p className="text-white">{formatDate(subscription?.effectiveDate)}</p>
                </div>

                <div>
                  <p className="text-gray-300">Subscription Expiry Date:</p>
                  <p className="text-white">{formatDate(subscription?.expiryDate)}</p>
                </div>

                <div>
                  <p className="text-gray-300">Subscription Price:</p>
                  <p className="text-white">{subscription?.price || "$14.44/month"}</p>
                </div>

                <div>
                  <p className="text-gray-300">Auto-Renewal:</p>
                  <div className="flex items-center mt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subscription?.autoRenew}
                        onChange={handleUpdate}
                        disabled={isUpdating}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0066ff]"></div>
                      <span className="ml-3 text-white">{subscription?.autoRenew ? "Enabled" : "Disabled"}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-6 py-3 bg-transparent border border-red-500 text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
              >
                Cancel Subscription
              </button>

              <button
                onClick={handleClose}
                className="px-6 py-3 bg-[#0066ff] text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b2e] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Cancel Subscription</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to cancel your subscription? You will lose access to premium features at the end of
              your current billing period.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-transparent border border-gray-600 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSubscriptionPage

// BACKEND INTEGRATION NOTES:
// 1. Replace the RTK Query hooks with your actual backend endpoints
// 2. Implement proper subscription management with your payment provider
// 3. Add analytics tracking for subscription cancellations
// 4. Consider adding a feedback form when users cancel
// 5. Implement proper date formatting based on user locale

