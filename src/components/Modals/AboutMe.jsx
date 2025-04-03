import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUpdateProfileMutation } from "../../features/auth/authApi"; // RTK Query Mutation
import { useDispatch } from "react-redux";
import { userUpdated } from "../../features/auth/authSlice";

const ModalForAboutMe = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation(); // RTK Query hook
  const { register, handleSubmit, reset } = useForm();
  const location = useLocation();
  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Call the update profile mutation
      const response = await updateProfile(data).unwrap();

      // Dispatch updated user data to Redux
      dispatch(userUpdated(response));

      toast.success("Profile updated successfully!", {duration : 1000});
      const from = location.state?.from?.pathname || "/";
      navigate(from); // Redirect to homepage
      reset();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {duration : 1000});
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center z-50 mx-auto"
    >
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-4 dark:text-black"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6">About</h1>
          <p className="text-gray-600">Tell us about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xl font-medium text-gray-700 mb-4">
              What sport do you coach?
            </label>
            <textarea
              {...register("about_you", { required: "This field is required" })}
              className="w-full px-4 py-3 rounded-md border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
              placeholder="Tell us about your coaching experience..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full text-white font-medium bg-gradient-to-r from-custom-blue to-custom-indigo hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ModalForAboutMe;
