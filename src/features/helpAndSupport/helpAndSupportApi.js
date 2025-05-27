import { apiSlice } from "../api/apiSlice";

export const helpAndSupportApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation({
      query: ({ email, description }) => ({
        url: "/api/problem/report",
        method: "POST",
        body: { email, description }, // Pass the email and query as the request body
      }),
      transformResponse: (response) => {
        console.log("Feedback Response:", response);
        return response;
      },
    }),
  }),
});

export const { useSendFeedbackMutation } = helpAndSupportApi;
