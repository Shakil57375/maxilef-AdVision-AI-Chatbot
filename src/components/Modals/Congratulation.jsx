import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
export default function Congratulations() {
  const navigate = useNavigate();
  const location = useLocation();
  const onSubmit = (e) => {
    console.log("user is not authenticated");
    navigate("/login");
  };

  const closeModal = () => {
    // Navigate to another route, like home or login, to close the modal
    const from = location.state?.from?.pathname || "/";
    navigate(from);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={closeModal} // Close on backdrop click
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="relative w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl h-content flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-2xl text-red-600"
          >
            <IoMdClose />
          </button>

          {/* Verification Code Section */}
          <div className="flex-1 w-full max-w-md text-center flex flex-col items-center justify-center">
            <p className="text-base my-10">
              Your password has been updated, please change your password
              regularly
            </p>

            <h2 className="text-4xl font-bold text-[#2F2F2F] my-10">
              Congratulations!
            </h2>

            {/* Verification Code Inputs */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-[430px] h-12 py-4 px-8
                     bg-gradient-to-r from-custom-blue to-custom-indigo
                text-[#FAF1E6] hover:text-white rounded-3xl text-base flex items-center justify-center hover:scale-105 duration-200 my-10`}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
