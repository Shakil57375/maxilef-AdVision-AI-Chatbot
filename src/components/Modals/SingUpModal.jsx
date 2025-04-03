import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import labRatImage from "../../assets/lab-rat2.png" // Add the lab rat image
import logo from "../../assets/logo.png" // Add the logo image

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm()
  const password = watch("password")
  const acceptTerms = watch("termsAccepted")
  const navigate = useNavigate()
  const { handleSignup } = useAuth()

  // Handle form submission
  const onSubmit = async (data) => {
    if (!acceptTerms) {
      setError("termsAccepted", {
        type: "manual",
        message: "You must accept the company's terms and conditions to submit the form.",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await handleSignup({
        username: data.name,
        email: data.email,
        password: data.password,
      })

      localStorage.setItem(
        "email",
        JSON.stringify({
          email: data.email,
        }),
      )
      navigate("/verificationCode")
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Branding and Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative">
        <Link to={"/home"} className="absolute top-8 left-8">
                    <img src={logo} alt="" />
        </Link>

        <div className="flex flex-col items-center justify-center">
          <img
            src={labRatImage || "/placeholder.svg"}
            alt="Lab rat with glasses"
            className="h-auto object-contain"
          />
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 mx-4 bg-gray-900 rounded-3xl">
          <h2 className="text-3xl font-bold text-white mb-2">Sign up</h2>

          <p className="text-gray-300 mb-8">
            If you already have an account register <br />
            You can{" "}
            <Link to="/login" className="text-blue-500 hover:underline font-medium">
              Login here !
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
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
                  {...formRegister("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Please enter a valid email",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your User name"
                  {...formRegister("name", {
                    required: "Name is required",
                  })}
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...formRegister("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                  className="block w-full pl-10 pr-10 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your Password"
                  {...formRegister("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) => value === password || "Passwords do not match",
                  })}
                  className="block w-full pl-10 pr-10 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="termsAccepted"
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 mt-1"
                {...formRegister("termsAccepted")}
              />
              <label htmlFor="termsAccepted" className="text-sm text-gray-400">
                By creating an account, I accept the Terms & Conditions & Privacy Policy.
              </label>
            </div>
            {errors.termsAccepted && <p className="text-sm text-red-400">{errors.termsAccepted.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

