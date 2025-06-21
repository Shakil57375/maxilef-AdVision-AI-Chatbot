import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { userLoggedIn, userLoggedOut } from "../auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: "http://adfusionlabs.ai:5006",
  prepareHeaders: (headers, { getState }) => {
    // Try to get token from Redux state
    const token = getState().auth?.accessToken || null
    // If token not in state, retrieve from local storage
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    } else {
      const authData = JSON.parse(localStorage.getItem("persist:chat-app-root") || "{}")
      const authState = authData.auth ? JSON.parse(authData.auth) : null
      if (authState?.accessToken) {
        headers.set("authorization", `Bearer ${authState.accessToken}`)
      }
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // If we get a 401 (unauthorized), try to refresh the token
  if (result?.error && result.error.status === 401) {

    // Get refresh token from state or localStorage
    const state = api.getState()
    let refreshToken = state.auth?.refreshToken

    if (!refreshToken) {
      const authData = JSON.parse(localStorage.getItem("persist:chat-app-root") || "{}")
      const authState = authData.auth ? JSON.parse(authData.auth) : null
      refreshToken = authState?.refreshToken
    }

    if (refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        {
          url: "/api/auth/refresh-token",
          method: "POST",
          body: { token: refreshToken },
        },
        api,
        extraOptions,
      )

      if (refreshResult?.data?.success) {

        // Get current user data
        const currentUser = state.auth?.user
        const currentRefreshToken = state.auth?.refreshToken

        // Update the auth state with new access token
        api.dispatch(
          userLoggedIn({
            user: currentUser,
            token: refreshResult.data.accessToken,
            refreshToken: currentRefreshToken,
          }),
        )

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions)
      } else {
        // Refresh failed, log out the user
        api.dispatch(userLoggedOut())
      }
    } else {
      // No refresh token available, log out the user
      api.dispatch(userLoggedOut())
    }
  }

  return result
}

export const apiSlice = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["user", "Chats"],
  endpoints: () => ({}),
})
