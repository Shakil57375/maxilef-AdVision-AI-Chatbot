import { apiSlice } from "../api/apiSlice";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch active packages
    getActivePackages: builder.query({
      query: () => "api/package/active",
      providesTags: ["Packages"],
    }),

    // Create a Stripe session for payment
    createStripeSession: builder.mutation({
      query: (packId) => ({
        url: "api/subscription/stripe-session",
        method: "POST",
        body: { packId },
      }),
    }),
    getSubscriptionDetails: builder.query({
      query: () => "api/subscription/details",
      providesTags: ["Subscription"],
    }),
    CancelSubscription: builder.mutation({
      query: () => ({
        url: "api/subscription/cancel",
        method: "POST",
      }),
    }),
  }),
});

export const { useGetActivePackagesQuery, useCreateStripeSessionMutation, useCancelSubscriptionMutation, useGetSubscriptionDetailsQuery } = subscriptionApi;