import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from "../../Firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../features/auth/authSlice";
import googleIcon from "../../image/google.png";
import appleIcon from "../../assets/apple.png"; // You'll need to add this image
import labRatImage from "../../assets/lab-rat.png"; // Add the lab rat image
import logo from "../../assets/logo.png"; // Add the logo image
const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleLogin, isLoginLoading } = useAuth();
  const auth = getAuth(app);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Get Firebase token
      const idToken = await user.getIdToken();

      // Send token to backend
      const response = await fetch(
        `http://72.167.224.36:5006/api/auth/oauth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user?.email,
            name: user?.displayName,
            profileImage: user?.photoURL,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Google Login successful, backend response:", data);

        dispatch(userLoggedIn({ refreshToken: data.refreshToken, token: data.accessToken, user: data.user }))

        localStorage.setItem("auth", JSON.stringify(data));
        navigate("/");
      } else {
        throw new Error("Backend login failed.");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      setError("Failed to login with Google. Please try again.");
    }
  };

  // Handle Apple Login
  const handleAppleLogin = () => {
    // Apple login implementation would go here
    console.log("Apple login clicked");
  };

  // Handle form login
  const onSubmit = async (credentials) => {
    console.log({ email: credentials.email, password: credentials.password });

    try {
      setError("");
      const data = await handleLogin({
        email: credentials.email,
        password: credentials.password,
      });
      localStorage.setItem(
        "email",
        JSON.stringify({
          email: credentials.email,
        })
      );

      // if (!data.user_profile?.is_verified) {
      //   navigate("/verificationCode")
      // } else if (!data.user_profile?.about_you) {
      //   navigate("/aboutMe")
      // } else {
      navigate("/");
      // }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.data?.message || "Incorrect email/password, please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Branding and Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center  relative">
        <Link to={"/home"} className="absolute top-8 left-8">
          <img src={logo} alt="" />
        </Link>

        <div className="flex flex-col items-center justify-center">
          <img
            src={labRatImage || "/placeholder.svg"}
            alt="Lab rat with glasses"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-3xl p-8 mx-4 bg-gray-900 rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-2">Log in</h2>

          <p className="text-gray-300 mb-8">
            If you don&apos;t have an account register <br />
            You can{" "}
            <Link
              to="/signUp"
              className="text-blue-500 hover:underline font-medium"
            >
              Register here !
            </Link>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="block w-full pl-10 pr-10 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPass ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-400"
                >
                  Remembr me
                </label>
              </div>
              <Link
                to="/forgetPassword"
                className="text-sm text-gray-300 hover:text-blue-500"
              >
                Forgot Password ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoginLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLoginLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              {/* <button
                onClick={handleAppleLogin}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <img
                  src={appleIcon || "/placeholder.svg"}
                  alt="Apple"
                  className="h-8 w-8"
                />
              </button> */}
              <button
                onClick={handleGoogleLogin}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <img
                  src={googleIcon || "/placeholder.svg"}
                  alt="Google"
                  className="h-8 w-8"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
