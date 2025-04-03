import { apiSlice } from "../api/apiSlice"

// Dummy subscription plans for development
const DUMMY_PLANS = [
  {
    id: "free",
    name: "Free plan",
    price: 0,
    period: "30 Days",
    description: "per user/month, billed annually",
    popular: false,
    features: [
      { text: "Ask up to 3 questions per month", included: true },
      { text: "Get AI-generated answers", included: true },
      { text: "No photo uploads", included: false },
      { text: "No unlimited access", included: false },
    ],
  },
  {
    id: "standard",
    name: "Standard Plan",
    price: 14.44,
    period: "Month",
    description: "per user/month, billed annually",
    popular: true,
    features: [
      { text: "Unlimited questions & answers", included: true },
      { text: "Upload photos for AI analysis", included: true },
      { text: "Priority support", included: true },
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 144.44,
    period: "Year",
    description: "Save $28.84",
    popular: false,
    features: [
      { text: "Everything in the Standard Plan", included: true },
      { text: "Best value – save on yearly billing", included: true },
      { text: "Exclusive updates & priority features", included: true },
    ],
  },
]

// Dummy user subscription for development
const DUMMY_USER_SUBSCRIPTION = {
  planId: "standard",
  planName: "Standard Plan",
  effectiveDate: "2023-03-20T00:00:00.000Z",
  expiryDate: "2024-03-20T00:00:00.000Z",
  price: "$14.44/month",
  status: "active",
  autoRenew: true,
}

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subscription plans
    getSubscriptionPlans: builder.query({
      query: () => "/subscriptions/plans",
      // For development, return dummy plans
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        return { data: DUMMY_PLANS }
      },
      providesTags: ["Subscriptions"],
    }),

    // Get user's current subscription
    getUserSubscription: builder.query({
      query: () => "/subscriptions/user",
      // For development, return dummy user subscription
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        return { data: DUMMY_USER_SUBSCRIPTION }
      },
      providesTags: ["Subscriptions"],
    }),

    // Subscribe to a plan
    subscribeToPlan: builder.mutation({
      query: (planId) => ({
        url: "/subscriptions/subscribe",
        method: "POST",
        body: { planId },
      }),
      // For development, simulate subscription
      async queryFn(planId, _queryApi, _extraOptions, fetchWithBQ) {
        const plan = DUMMY_PLANS.find((p) => p.id === planId)
        if (!plan) {
          return { error: { status: 404, data: "Plan not found" } }
        }

        return {
          data: {
            ...DUMMY_USER_SUBSCRIPTION,
            planId,
            planName: plan.name,
            price: plan.price === 0 ? "Free" : `$${plan.price}/${plan.period.toLowerCase()}`,
            effectiveDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }
      },
      invalidatesTags: ["Subscriptions", "user"],
    }),

    // Update subscription (e.g., cancel auto-renewal)
    updateSubscription: builder.mutation({
      query: (updateData) => ({
        url: "/subscriptions/update",
        method: "PUT",
        body: updateData,
      }),
      // For development, simulate update
      async queryFn(updateData, _queryApi, _extraOptions, fetchWithBQ) {
        return {
          data: {
            ...DUMMY_USER_SUBSCRIPTION,
            ...updateData,
          },
        }
      },
      invalidatesTags: ["Subscriptions"],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      // For development, simulate cancellation
      async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
        return {
          data: {
            ...DUMMY_USER_SUBSCRIPTION,
            status: "cancelled",
            autoRenew: false,
          },
        }
      },
      invalidatesTags: ["Subscriptions"],
    }),
  }),
})

export const {
  useGetSubscriptionPlansQuery,
  useGetUserSubscriptionQuery,
  useSubscribeToPlanMutation,
  useUpdateSubscriptionMutation,
  useCancelSubscriptionMutation,
} = subscriptionApi

// BACKEND INTEGRATION NOTES:
// 1. Remove the queryFn implementations when connecting to a real backend
// 2. Update the endpoint URLs to match your API routes
// 3. Ensure your backend returns subscription data in the expected format
// 4. Add payment processing integration where needed
// 5. Consider adding webhooks for subscription status updates from payment providers

