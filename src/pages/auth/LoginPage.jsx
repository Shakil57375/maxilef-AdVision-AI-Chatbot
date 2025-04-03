import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "../../features/auth/authSlice"
import { useLoginMutation } from "../../features/auth/authApi"
import logo from "../../assets/logo.png"
import labRat from "../../assets/lab-rat.png"
import toast from "react-hot-toast"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [login, { isLoading }] = useLoginMutation()

  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  // Show success message if redirected from registration
  useEffect(() => {
    if (location.state?.registered) {
      toast.success("Registration successful! Please log in.")
    }
    if (location.state?.passwordReset) {
      toast.success("Password reset successful! Please log in with your new password.")
    }
    if (location.state?.verified) {
      toast.success("Email verification successful! Please log in.")
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setError("")

      // Call login mutation from RTK Query
      await login({ email, password }).unwrap()

      // Success message
      toast.success("Login successful!")

      // Navigation will happen automatically due to the useEffect above
    } catch (error) {
      console.error("Login error:", error)
      setError(error?.data?.message || error?.data?.error || "Invalid email or password")
    }
  }

  const handleSocialLogin = (provider) => {
    // This would be replaced with actual social login logic
    toast.error("Social login is not implemented yet")
  }

  return (
    <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row">
        {/* Left side with logo and image */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8">
          <Link to="/" className="mb-8">
            <img src={logo || "/placeholder.svg"} alt="Adfusion Labs Logo" className="h-16" />
          </Link>
          <img src={labRat || "/placeholder.svg"} alt="Lab Rat Scientist" className="max-w-full md:max-w-md mx-auto" />
        </div>

        {/* Right side with login form */}
        <div className="md:w-1/2 bg-[#1a1b2e] rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6">Log in</h2>

          <p className="text-gray-300 mb-6">
            If you don&apos;t have an account register
            <Link to="/register" className="text-[#a855f7] hover:underline ml-1">
              Register here !
            </Link>
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 py-2 pl-10 pr-4 text-white focus:border-[#a855f7] focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-600 py-2 pl-10 pr-10 text-white focus:border-[#a855f7] focus:outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#a855f7] focus:ring-[#a855f7] border-gray-600 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <Link to="/verify-email" className="text-sm text-[#a855f7] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-center text-gray-400 mb-4">or continue with</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSocialLogin("apple")}
                className="bg-[#1a1b2e] border border-gray-700 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
                </svg>
              </button>
              <button
                onClick={() => handleSocialLogin("google")}
                className="bg-[#1a1b2e] border border-gray-700 p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

