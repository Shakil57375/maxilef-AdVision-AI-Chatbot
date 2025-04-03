import { apiSlice } from "../api/apiSlice";

export const helpAndSupportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation({
      query: ({ email, query }) => ({
        url: "/help_support/send_feedback/",
        method: "POST",
        body: { email, query }, // Pass the email and query as the request body
      }),
      transformResponse: (response) => {
        console.log("Feedback Response:", response);
        return response;
      },
    }),
  }),
});

export const { useSendFeedbackMutation } = helpAndSupportApi;
