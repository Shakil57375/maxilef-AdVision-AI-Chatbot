import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function ModalForVerificationCode() {
  const [code, setCode] = useState(new Array(4).fill("")); // For 4-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  const navigate = useNavigate();
  const [resendOtp, { isLoading: isResendOtpLoading }] = useResendOtpMutation();
  const token = useSelector((state) => state.auth.accessToken);
  // Get temporary email from localStorage
  const authData = JSON.parse(localStorage.getItem("email")); // Correctly parse the `auth` object
  const email = authData?.email; // Retrieve the `email`

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
    setIsLoading(true);

    try {
      if (!email) {
        toast.error("Email not found. Please try again.", { duration: 1000 });
        return;
      }

      if (code.join("").length !== 4) {
        toast.error("Please enter a valid 4-digit code.", { duration: 1000 });
        return;
      }

      // Use email and OTP to verify
      await verifyEmail({ email: email, otp: code.join("") }).unwrap();
      toast.success("Verification successful!", { duration: 1000 });

      // Redirect to "About Me" page
      navigate("/");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(
        error?.data?.message || "Verification failed. Please try again.",
        { duration: 1000 }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp(token).unwrap();
      toast.success(response?.message || "OTP resent successfully!", {
        duration: 1000,
      });
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to resend OTP. Please try again.",
        { duration: 1000 }
      );
    }
  };

  return (
    <>
      {email && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="w-full max-w-md">
            {/* Logo */}
            <Link to={"/home"} className="flex justify-start mb-12 ml-4 absolute top-10 left-10">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_2025_03_15T02_18_52_369Z%20%5BConverted%5D-01%20%281%29%202-SeEkhgHsnKbwKMoRbJmgbGRalgd52L.png"
                alt="AdFusion Labs Logo"
                className="h-12"
              />
            </Link>

            <div className="bg-[#222222] p-10 rounded-xl shadow-xl">
              <h2 className="text-2xl font-semibold text-white mb-16 text-center">
                Verify Email By Providing the code which is sent to your email
              </h2>

              <form onSubmit={onSubmit} className="space-y-12">
                <div
                  onPaste={handlePaste}
                  className="flex justify-center gap-4"
                >
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleInputChange(e.target, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      maxLength={1}
                      className="w-14 h-14 text-center text-lg font-medium bg-[#2C3E5D] text-white border-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-8 text-white rounded-full text-base font-medium ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </form>

              <div className="flex items-center gap-1 justify-center mt-6 text-gray-400 text-sm">
                <p>Didn&apos;t receive the code?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={isResendOtpLoading}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {isResendOtpLoading ? "Resending..." : "Resend"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
