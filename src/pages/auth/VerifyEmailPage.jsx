import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useVerifyEmailMutation } from "../../features/auth/authApi"
import logo from "../../assets/logo.png"

const VerifyEmailPage = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if email was passed from registration
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Please enter your email")
      return
    }

    try {
      setError("")

      // Call verifyEmail mutation from RTK Query
      const result = await verifyEmail(email).unwrap()

      if (result.success) {
        setSuccess(true)
        // Redirect to OTP verification page after a short delay
        setTimeout(() => {
          navigate("/verify-otp", { state: { email } })
        }, 1500)
      }
    } catch (error) {
      setError(error?.data?.message || "Failed to send verification code")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/home">
            <img src={logo || "/placeholder.svg"} alt="Adfusion Labs Logo" className="h-16 mx-auto" />
          </Link>
        </div>

        <div className="bg-[#1a1b2e] rounded-lg p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify</h2>
          <p className="text-gray-300 mb-8 text-center">Type your email Id</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
              Verification code sent successfully! Redirecting...
            </div>
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
                  className="w-full bg-transparent border-b border-gray-600 py-2 pl-10 pr-4 text-white focus:border-[#0066ff] focus:outline-none"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-[#0066ff] hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage

// BACKEND INTEGRATION NOTES:
// 1. Replace the verifyEmail mutation with your actual backend endpoint
// 2. Add rate limiting to prevent abuse of the OTP system
// 3. Consider adding a resend OTP button with a cooldown timer

