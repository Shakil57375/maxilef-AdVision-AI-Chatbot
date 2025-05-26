import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useSendFeedbackMutation } from "../../features/helpAndSupport/helpAndSupportApi";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";

export const HelpAndSupportPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser); // Get user data from Redux store
  // RTK Query Mutation
  const [sendFeedback, { isLoading }] = useSendFeedbackMutation();

  const onSubmit = async (data) => {
    try {
      const response = await sendFeedback({
        email: user?.email,
        description: data.description,
      }).unwrap();
      toast.success(response?.Message || "Feedback submitted successfully!");
      reset(); // Reset form fields
      navigate(-1); // Go back after submission
    } catch (error) {
      console.error("Feedback submission failed:", error);
      toast.error("Failed to send feedback. Please try again.", {
        duration: 1000,
      });
    }
  };

  const onCancel = () => {
    const from = location.state?.from?.pathname || "/";
    navigate(-1); // Navigate back when canceling
  };

  return (
    <div className="min-h-screen my-auto bg-[#1F1F1F] text-white p-4 md:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl lg:mx-4 mx-0 dark:bg-gray-700 dark:text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-8">
            Help & Support
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* We'll hide the email field but keep it in the form for functionality */}
            <div className="hidden">
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                defaultValue={
                  localStorage.getItem("email")
                    ? JSON.parse(localStorage.getItem("email")).email
                    : ""
                }
                className="w-full px-4 py-2 bg-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xl font-medium text-white">
                Please describe your problem
              </label>
              <textarea
                {...register("description", {
                  required: "Please describe your problem",
                })}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-blue-500 bg-[#212121] text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Type your message here..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onCancel}
                className="py-2 px-6 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-8 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Sent"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HelpAndSupportPage;
