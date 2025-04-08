/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from "../features/auth/authApi";
import { userLoggedIn } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // RTK Query hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const { data: user, isLoading: isProfileLoading } = useGetUserProfileQuery(
    undefined,
    {
      skip: !localStorage.getItem("auth"),
    }
  );

  // Local state for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth")
  );

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials).unwrap();
      console.log("data from here", data);
      dispatch(
        userLoggedIn({
          refreshToken: data.refreshToken,
          token: data.accessToken,
          user: data.user,
        })
      );
      localStorage.setItem("auth", JSON.stringify(data));
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("Login failed:", error);

      toast.error("Incorrect email/password, please try again.", {
        duration: 1000,
      });
      navigate("/login");
    }
  };

  // Signup function
  const handleSignup = async (userData) => {
    try {
      const { data } = await register(userData).unwrap();
      localStorage.setItem("auth", JSON.stringify(data));
      toast.success("Signup successful! Please verify your email.", {
        duration: 1000,
      });
      console.log("from auth Context .........................");

      // Return success to onSubmit
      return data;
    } catch (error) {
      console.error("Signup failed:", error?.data?.Error || "Unknown error");
      toast.error(
        "This email is already registered. Please log in or use a different email address.",
        { duration: 1000 }
      );
      // Throw the error so onSubmit can handle it
      throw error;
    }
  };

  // Verify email function
  const handleVerifyEmail = async (username, otp) => {
    try {
      const { data } = await verifyEmail({ username, otp }).unwrap();
      localStorage.setItem("auth", JSON.stringify(data));
      // navigate("/aboutMe");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error("Verification failed. Please try again.", { duration: 1000 });
    }
  };

  // Update profile function
  const handleUpdateProfile = async (profileData) => {
    try {
      const { data } = await updateProfile(profileData).unwrap();
      const authData = JSON.parse(localStorage.getItem("auth"));
      localStorage.setItem(
        "auth",
        JSON.stringify({ ...authData, user_profile: data })
      );
      toast.success("Profile updated successfully!", { duration: 1000 });
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.", {
        duration: 1000,
      });
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
    toast.success("Logged out successfully.", { duration: 1000 });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        handleLogin,
        handleSignup,
        handleVerifyEmail,
        handleUpdateProfile,
        handleLogout,
        isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
