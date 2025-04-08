import { apiSlice } from "../api/apiSlice"
import { userLoggedIn } from "./authSlice"

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "api/auth/signup",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("Signup successful:", data)
          dispatch(userLoggedIn({ refreshToken: data.refreshToken, token: data.accessToken, user: data.user }))
        } catch (error) {
          console.error("Signup failed:", error)
          return
        }
      },
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "api/auth/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("Login successful:", data)
          dispatch(userLoggedIn({ refreshToken: data.refreshToken, token: data.accessToken, user: data.user }))
        } catch (error) {
          console.error("Login failed:", error)
        }
      },
    }),

    verifyEmail: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/api/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),

    getUserProfile: builder.query({
      query: () => "api/user/profile",
      providesTags: ["user"],
    }),

    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "api/user/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("Profile updated successfully:", data)
        } catch (error) {
          console.error("Profile update failed:", error)
        }
      },
    }),

    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "api/user/upload-profile-image",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["user"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("Profile image uploaded successfully:", data)
        } catch (error) {
          console.error("Profile image upload failed:", error)
        }
      },
    }),

    resendOtp: builder.mutation({
      query: (token) => ({
        url: "/authentication_app/resend_otp/",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("OTP Resent Successfully:", data)
        } catch (error) {
          console.error("Failed to resend OTP:", error)
        }
      },
    }),

    sendForgotPasswordOtp: builder.mutation({
      query: (email) => ({
        url: "api/auth/password/reset",
        method: "POST",
        body: { email: email },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("OTP sent successfully:", data)
        } catch (error) {
          console.error("Failed to send OTP for forgot password:", error)
        }
      },
    }),

    verifyForgetPasswordOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "api/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("OTP Verified Successfully:", data)
        } catch (error) {
          console.error("OTP Verification Failed:", error)
        }
      },
    }),

    resetPassword: builder.mutation({
      query: ({ email, otp, newPassword }) => ({
        url: "api/auth/password/reset/verify",
        method: "POST",
        body: { email, otp, newPassword },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          console.log("Password Reset Successful:", data)
        } catch (error) {
          console.error("Password Reset Failed:", error)
        }
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
  useResendOtpMutation,
  useSendForgotPasswordOtpMutation,
  useVerifyForgetPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi
