import { apiSlice } from "../api/apiSlice";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    upgradePlan: builder.mutation({
      query: ({ subscription_plan }) => ({
        url: "/subscription_app/buy_subscription_on_web/",
        method: "POST",
        body: { subscription_plan }, // Correct body parameter
      }),
      transformResponse: (response) => {
        console.log("Raw API response:", response);
        return response;
      },
    }),

    // Cancel subscription API
    cancelSubscription: builder.mutation({
      query: () => ({
        url: "/subscription_app/cancel_subscription/",
        method: "GET",
      }),
      transformResponse: (response) => {
        console.log("Cancel Subscription Response:", response);
        return response;
      },
    }),
  }),
});

export const { useUpgradePlanMutation, useCancelSubscriptionMutation } =
  subscriptionApi;
