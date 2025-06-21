import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
  },
  reducers: {
    userLoggedIn: (state, action) => {
      // Assign user profile and tokens to state
      state.user = action.payload.user
      state.accessToken = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    userUpdated: (state, action) => {
      // Update user profile
      state.user = { ...state.user, ...action.payload }
    },
    userLoggedOut: (state) => {
      // Clear user data and tokens
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      // Clear localStorage
      localStorage.removeItem("persist:chat-app-root")
    },
    tokenRefreshed: (state, action) => {
      // Update only the access token
      state.accessToken = action.payload.accessToken
    },
  },
})

export const { userLoggedIn, userUpdated, userLoggedOut, tokenRefreshed } = authSlice.actions

// Selectors
export const selectUser = (state) => state.auth.user
export const selectAccessToken = (state) => state.auth.accessToken
export const selectRefreshToken = (state) => state.auth.refreshToken

export default authSlice.reducer
