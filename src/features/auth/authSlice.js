import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
  },
  reducers: {
    userLoggedIn: (state, action) => {
      console.log("THis is from authSilce ................................",action.payload.token)
      // Assign user profile and token to state
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.refreshToken = action.payload.refreshToken; // Store refresh token if needed
    },
    userUpdated: (state, action) => {
      // Update user profile
      state.user = { ...state.user, ...action.payload };
    },
    userLoggedOut: (state) => {
      // Clear user data and token
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null; // Clear refresh token if needed
      localStorage.removeItem("auth");
    },
  },
});
export const { userLoggedIn, userUpdated, userLoggedOut } = authSlice.actions;


// Selectors
export const selectUser = state => state.auth.user;
export const selectAccessToken = state => state.auth.accessToken;


export default authSlice.reducer;
