import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useVerifyForgetPasswordOtpMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png"; // Add the logo image

export default function VerifyOtpPage() {
  const [code, setCode] = useState(new Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [verifyOtp] = useVerifyForgetPasswordOtpMutation();
  const navigate = useNavigate();

  // Get temporary email from localStorage
  const authData = JSON.parse(localStorage.getItem("email"));
  const email = authData?.email;
  console.log(email);
  useEffect(() => {
    // Focus the first input field when component mounts
    const firstInput = document.getElementById("code-0");
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleInputChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Only allow numbers
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Automatically move to the next input
    if (value && index < code.length - 1) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (code[index] === "" && index > 0) {
        document.getElementById(`code-${index - 1}`).focus(); // Move back
      } else {
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 4);
    const newCode = [...code];

    pastedData.split("").forEach((char, i) => {
      if (i < newCode.length) {
        newCode[i] = char;
      }
    });

    setCode(newCode);

    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < newCode.length) {
      document.getElementById(`code-${lastFilledIndex}`).focus();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Join the code array into a single OTP string
    const otp = code.join("");
    localStorage.setItem(
      "otp",
      JSON.stringify({
        otp: otp,
      })
    );
    if (otp.length !== 4) {
      toast.error("Please enter a valid 4-digit OTP.", { duration: 1000 });
      return;
    }

    setIsLoading(true);

    try {
      // Call the mutation to verify the OTP
      const response = await verifyOtp({ email, otp }).unwrap();
      toast.success(response?.Message || "OTP verified successfully!", {
        duration: 1000,
      });

      // Navigate to the reset password page
      navigate("/resetPass", { state: { email } });
    } catch (error) {
      console.error("OTP Verification Failed:", error);
      toast.error(
        error?.data?.Message || "Failed to verify OTP. Please try again.",
        { duration: 1000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null; // Don't render anything if email is not available
  }

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Header with logo */}
      <Link to={"/home"} className="absolute top-8 left-8">
        <img src={logo} alt="" />
      </Link>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          className="w-full max-w-2xl p-8 mx-4 bg-gray-900 rounded-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Verify OTP</h2>
          </div>

          <form onSubmit={onSubmit} className="space-y-12">
            <div onPaste={handlePaste} className="flex justify-center gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(e.target, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                  maxLength={1}
                  className="w-14 h-14 text-center text-lg font-medium bg-blue-900/50 text-white border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {isLoading ? "Verifying..." : "Login"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
