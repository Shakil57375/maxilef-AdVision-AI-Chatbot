import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSendForgotPasswordOtpMutation } from "../../features/auth/authApi";
import logo from "../../assets/logo.png"; // Add the logo image

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [sendOtp, { isLoading }] = useSendForgotPasswordOtpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    console.log(data.email);
    try {
      const response = await sendOtp(data.email).unwrap();
      toast.success(response?.Message || "OTP sent successfully!", {
        duration: 1000,
      });
      localStorage.setItem(
        "email",
        JSON.stringify({
          email: data?.email,
        })
      );
      navigate("/verifyForgetPasswordOtp");
    } catch (error) {
      toast.error("Invalid Email Please Try Again Or Contact Admin ", {
        duration: 1000,
      });
    }
  };

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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white">Verify</h2>
            <p className="mt-2 text-gray-300">Type your email Id</p>
          </div>

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
                  className="block w-full pl-10 pr-3 py-3 bg-gray-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-500 "
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors !mt-10"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
