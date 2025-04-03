import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useVerifyForgetPasswordOtpMutation } from "../../features/auth/authApi"
import logo from "../../assets/logo.png"
import toast from "react-hot-toast"

const VerifyResetOtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const [verifyForgetPasswordOtp, { isLoading }] = useVerifyForgetPasswordOtpMutation()

  const navigate = useNavigate()
  const location = useLocation()

  // Check if email was passed from forgot password page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    } else {
      // If no email in state, redirect to forgot password
      navigate("/forgot-password")
    }
  }, [location.state, navigate])

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input if value is entered
    if (value && index < 3 && document.getElementById(`otp-${index + 1}`)) {
      document.getElementById(`otp-${index + 1}`).focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0 && document.getElementById(`otp-${index - 1}`)) {
        // If current input is empty and backspace is pressed, focus previous input
        document.getElementById(`otp-${index - 1}`).focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const otpValue = otp.join("")

    if (otpValue.length !== 4 || !email) {
      setError("Please enter a valid 4-digit OTP and email")
      return
    }

    try {
      setError("")

      // Call verifyOtp mutation
      const result = await verifyForgetPasswordOtp({ email, otp: otpValue }).unwrap()

      if (result.success) {
        toast.success("OTP verified successfully!")
        // Navigate to reset password page
        navigate("/reset-password", { state: { email, otp: otpValue } })
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError(error?.data?.message || error?.data?.error || "Invalid OTP")
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
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Verify OTP</h2>
          <p className="text-gray-300 mb-8 text-center">Enter the 4-digit code sent to {email || "your email"}</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-4 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-xl bg-[#2d2e3f] border border-gray-600 rounded-md text-white focus:border-[#a855f7] focus:outline-none"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 px-4 rounded-md transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyResetOtpPage

