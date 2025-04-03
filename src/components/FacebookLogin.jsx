import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userLoggedIn } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import facebookLogo from "../assets/Facebook (1).png";
const LoginForm = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handleFacebookCallback = async (response) => {
    if (response?.status === "unknown" || !response.accessToken) {
      console.error(
        "Facebook Login Error:",
        "Something went wrong with Facebook Login."
      );
      return;
    }

    console.log("Facebook Login Successful:", response);

    const { name, email, accessToken } = response;

    try {
      // Send the Facebook token and user details to your backend
      const res = await fetch(
        `https://backend.gameplanai.co.uk/authentication_app/social_signup_signin/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email,
            token: accessToken,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("Backend Facebook Login Successful:", data);

        dispatch(
          userLoggedIn({
            user: data.user_profile,
            token: data.access,
          })
        );

        localStorage.setItem("auth", JSON.stringify(data));

        if (!data.user_profile?.is_verified) {
          navigate("/verificationCode");
        } else if (!data.user_profile?.about_you) {
          navigate("/aboutMe");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Backend login failed");
      }
    } catch (error) {
      console.error("Facebook Login Backend Error:", error);
      alert("Failed to log in with Facebook. Please try again.");
    }
  };

  return (
    <FacebookLogin
      appId="467919186151366" // Your Facebook App ID
      autoLoad={false}
      fields="name,email,picture"
      callback={handleFacebookCallback}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className="flex items-center justify-center"
        >
          <img src={facebookLogo} alt="" />
        </button>
      )}
    />
  );
};

export default LoginForm;
