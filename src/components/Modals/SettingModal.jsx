import { IoMdClose } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export const ModalForSettings = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Import useLocation
  const onClose = () => {
    const from = location.state?.from?.pathname || "/";
    navigate(from); 
  };
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 mx-auto "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="bg-white lg:w-[573px] w-full p-8 rounded-lg shadow-lg relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <IoMdClose className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Settings</h2>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">
            Subscription Details
          </h3>

          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-lg font-semibold">Standard</div>
            <div className="text-2xl font-bold mt-1">80$</div>
            <div className="text-sm text-gray-500 mt-1">
              expire date: 11/09/24
            </div>
          </div>

          <button className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            Update
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
