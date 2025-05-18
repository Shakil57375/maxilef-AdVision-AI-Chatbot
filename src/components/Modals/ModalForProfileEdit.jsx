import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import userImage from "../../assets/file (5).png";
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "../../features/auth/authApi";
import { useDispatch } from "react-redux";
import { userUpdated } from "../../features/auth/authSlice";
import { useGetSubscriptionDetailsQuery } from "../../features/subscription/subscriptionApi";
import toast from "react-hot-toast";

const ProfileModal = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { data } = useGetSubscriptionDetailsQuery();
  const subscriptionInfo = data?.subscription || null;
  const [tempData, setTempData] = useState({
    name: "",
    email: "",
    subscription_status: "",
    subscription_expires_on: "",
    profileImage: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Fetch user profile data
  const { data: profileData, isLoading, refetch } = useGetUserProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [uploadProfileImage] = useUploadProfileImageMutation();

  useEffect(() => {
    if (profileData?.user && !isUpdating) {
      // Only update tempData and previewImage when not updating to prevent overwriting
      setTempData({
        name: profileData.user.name || "",
        email: profileData.user.email || "",
        subscription_status: profileData.user.role || "Free",
        subscription_expires_on: profileData.user.updatedAt || "",
        profileImage: profileData.user.profileImage || "",
      });
      // Only set previewImage if no local image is set (i.e., on initial load or after successful upload)
      if (!previewImage || !imageFile) {
        setPreviewImage(profileData.user.profileImage || userImage);
      }
    }
    dispatch(userUpdated(profileData?.user));
  }, [profileData, isUpdating, previewImage, imageFile]);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageUpload = (e) => {
    if (!isEditing) return;

    const file = e.target.files[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);

      // Update profile information
      await updateProfile({
        name: tempData.name,
        email: tempData.email,
      }).unwrap();

      // Upload profile image if a new one was selected
      let newImageUrl = previewImage;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadResult = await uploadProfileImage(formData).unwrap();
        // Assuming the API returns the new image URL in uploadResult
        newImageUrl = uploadResult.imageUrl || previewImage;
      }

      // Refresh profile data
      await refetch();
      // Update previewImage with the new server image URL (if available)
      setPreviewImage(newImageUrl);
      setImageFile(null); // Clear the image file after successful upload
      toast.success("Profile updated successfully!", { duration: 1000 });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
      // Revert to server image on error
      setPreviewImage(profileData?.user?.profileImage || userImage);
      setImageFile(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 md:p-8 flex items-start justify-center">
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
          className="relative bg-black rounded-lg shadow-lg p-8 w-full max-w-3xl mx-4 text-white"
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

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF00AA]"></div>
            </div>
          ) : (
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
                    className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg cursor-pointer bg-gray-800 text-white ${
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
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={tempData?.name || ""}
                    onChange={(e) =>
                      setTempData({ ...tempData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-700 bg-gray-800 text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Subscription
                  </label>
                  <input
                    value={subscriptionInfo?.type || "N/A"}
                    disabled
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-700 bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={tempData?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-700 bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Expiry (Date):
                  </label>
                  <input
                    type="text"
                    value={formatDate(subscriptionInfo?.ends)}
                    disabled
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-700 bg-gray-700 text-white"
                  />
                </div>

                <button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={isUpdating}
                  className={`w-full py-3 px-4 rounded-full text-white font-medium ${
                    isUpdating
                      ? "bg-gray-400 cursor-not-allowed"
                      : "p-3 bg-gradient-to-r from-[#FF00AA] to-[#01B9F9] rounded-md text-white mb-2"
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
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;