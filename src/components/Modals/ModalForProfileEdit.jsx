import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUpdateProfileMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import { userUpdated } from "../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import userImage from "../../assets/file (5).png";

const ProfileModal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access user data from Redux state
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  // RTK Query hook for updating profile
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Sync tempData with Redux user data
  useEffect(() => {
    if (user) {
      setTempData({ ...user });
      setPreviewImage(
        user?.profile_picture
          ? `https://backend.gameplanai.co.uk${user.profile_picture}`
          : null
      );
    }
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempData({ ...tempData, profile_picture: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(tempData).forEach((key) => {
        formData.append(key, tempData[key]);
      });

      // Call the RTK Query mutation
      const response = await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!", { duration: 1000 });

      // Update Redux state with the updated profile data
      dispatch(userUpdated(response));

      // Reset editing state and preview
      setIsEditing(false);
      setTempData({ ...response });
      setPreviewImage(
        response.profile_picture
          ? `https://backend.gameplanai.co.uk${response.profile_picture}`
          : null
      );

      const from = location.state?.from?.pathname || "/";
      navigate(from);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        duration: 1000,
      });
    }
  };

  const handleCancel = () => {
    setTempData({ ...user });
    setPreviewImage(
      user?.profile_picture
        ? `https://backend.gameplanai.co.uk${user.profile_picture}`
        : null
    );
    setIsEditing(false);
    navigate(-1);
  };

  console.log(tempData);
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8 flex items-start justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center z-50 mx-auto "
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl mx-4  text-white"
        >
          <button
            onClick={handleCancel}
            className="absolute right-4 top-4 text-2xl text-gray-400"
          >
            <IoMdClose />
          </button>

          <h1 className="text-2xl font-bold text-center mb-8">
            Personal Information
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={previewImage || userImage}
                  alt="Profile"
                  className="w-48 h-48 rounded-full object-cover"
                />
                <label
                  className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg cursor-pointer  text-white ${
                    !isEditing && "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <FiEdit2 className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={!isEditing}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="flex-1 space-y-4 ">
              <div>
                <label className="block text-sm font-medium text-white mb-1 ">
                  Full Name
                </label>
                <input
                  type="text"
                  value={tempData?.name || "please enter your name"}
                  onChange={(e) =>
                    setTempData({ ...tempData, name: e.target.value })
                  }
                  disabled
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50  text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1 ">
                  Subscription
                </label>
                <textarea
                  value={tempData?.subscription_status || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, about_you: e.target.value })
                  }
                  disabled
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50  text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1 ">
                  Email
                </label>
                <input
                  type="email"
                  value={tempData?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 bg-gray-700 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1 ">
                  Expiry (Date):
                </label>
                <input
                  type="email"
                  value={tempData?.subscription_expires_on || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50  text-black"
                />
              </div>

              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isUpdating}
                className={`w-full py-3 px-4 rounded-full text-white font-medium ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : " p-3 bg-gradient-to-r from-[#FF00AA] to-[#01B9F9]  rounded-md bg-gray-700 text-white mb-2 "
                }`}
              >
                {isEditing
                  ? isUpdating
                    ? "Saving..."
                    : "Save"
                  : "Edit Profile"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
