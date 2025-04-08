import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa"
import { motion } from "framer-motion"
import { useNavigate, useLocation, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useResetPasswordMutation } from "../../features/auth/authApi"
import logo from "../../assets/logo.png"; // Add the logo image

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const navigate = useNavigate()
  const location = useLocation()

  // Get email from localStorage
  const authData = JSON.parse(localStorage.getItem("email"))
  const email = authData?.email
  const otp = JSON.parse(localStorage.getItem("otp"))
  const forgetPasswordOTP = otp?.otp
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  // Watch for password validation
  const password = watch("newPassword")

  // Handle form submission
  const onSubmit = async (data) => {
    if (!email) {
      toast.error("Email is missing. Please try again.", { duration: 1000 })
      return
    }

    try {
      // Call mutation to reset the password
     
      const response = await resetPassword({
        email,
        otp: forgetPasswordOTP,
        newPassword: data.newPassword,
      }).unwrap()

      toast.success(response?.Message || "Password reset successfully!", { duration: 1000 })
      navigate("/login") // Redirect to login page
    } catch (error) {
      console.error("Password Reset Failed:", error)
      toast.error(error?.data?.Message || "Failed to reset password. Please try again.", { duration: 1000 })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Header with logo */}
      <div className="p-8">
      <Link to={"/home"} className="absolute top-8 left-8">
        <img src={logo} alt="" />
      </Link>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          className="w-full max-w-2xl p-8 mx-4 bg-gray-900 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  {...register("newPassword", {
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
              {errors.newPassword && <p className="mt-1 text-sm text-red-400">{errors.newPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confrim Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your Password"
                  {...register("confirmPassword", {
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-8"
            >
              {isLoading ? "Resetting..." : "Reset"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

