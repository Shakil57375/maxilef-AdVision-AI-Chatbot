import { apiSlice } from '../api/apiSlice';
import { tagtypes } from '../tagTypesLIst';
import { userLoggedIn } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/authentication_app/signup/",
        method: "POST",
        body: data,

      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { refresh, access } = data;

          // Dispatch userLoggedIn to update Redux state
          dispatch(userLoggedIn({ refresh: refresh, token: access }));

          // Persist user data to localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({ refresh, access })
          );

          console.log("Signup successful:", data);
        } catch (error) {
          console.error("Signup failed:", error);
          return;
        }
      },


    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/authentication_app/login/",
        method: "POST",
        body: data,
      }),
      invalidatesTags : ['user'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { refresh, access, user_profile } = data;
          console.log(access)
          // Dispatch userLoggedIn to update Redux state
          dispatch(
            userLoggedIn({
              user: user_profile,
              token: access, // Correctly map token to access
            })
          );

          // Persist user data to localStorage
          localStorage.setItem(
            "auth",
            JSON.stringify({ refresh, access, user_profile })
          );

          console.log("Login successful:", data);
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),

    verifyEmail: builder.mutation({
      query: ({ email, otp }) => ({
        url: '/authentication_app/verify_email/',
        method: 'POST',
        body: { email, otp },
      }),
    }),
    getUserProfile: builder.query({
      query: () => '/authentication_app/user_profile/',
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/authentication_app/user_profile/',
        method: 'POST', // Assuming POST is used for profile updates
        body: profileData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Update localStorage with the latest user profile
          const authData = JSON.parse(localStorage.getItem('accessToken'));
          localStorage.setItem(
            'accessToken',
            JSON.stringify({
              ...authData,
              user_profile: data, // Update the user_profile field
            })
          );

          console.log('Profile updated successfully and localStorage updated:', data);
        } catch (error) {
          console.error('Profile update failed:', error);
        }
      },
    }),
    resendOtp: builder.mutation({
      query: (token) => ({
        url: '/authentication_app/resend_otp/',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('OTP Resent Successfully:', data);
        } catch (error) {
          console.error('Failed to resend OTP:', error);
        }
      },
    }),
    sendForgotPasswordOtp: builder.mutation({
      query: (email) => ({
        url: "/authentication_app/forgot_password/",
        method: "POST",
        body: { email : email }, // Send the email directly, ensure it's correct
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(arg)
        console.log(queryFulfilled)
        try {
          const { data } = await queryFulfilled;
          console.log("OTP sent successfully:", data);
        } catch (error) {
          console.error("Failed to send OTP for forgot password:", error);
        }
      },
    }),
    
    verifyForgetPasswordOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/authentication_app/verify_forget_password_otp/",
        method: "POST",
        body: { email, otp }, // Send username and OTP in the request body
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("OTP Verified Successfully:", data);
        } catch (error) {
          console.error("OTP Verification Failed:", error);
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "/authentication_app/reset_password/",
        method: "POST",
        body: { email, password }, // Send username and new password in the request body
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Password Reset Successful:", data);
        } catch (error) {
          console.error("Password Reset Failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation, 
  useResendOtpMutation,
  useSendForgotPasswordOtpMutation,
  useVerifyForgetPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi;
