import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";
import { MdOutlineSettings, MdOutlineSupportAgent, MdPrivacyTip } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { TbChecklist } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../context/AuthContext.jsx";
import { userLoggedOut } from "../features/auth/authSlice";
import { IoMoon, IoSunny } from "react-icons/io5";
import { useGetUserProfileQuery } from "../features/auth/authApi.js";
import logo from "../assets/logo.png"; // Add the logo image
import { Settings } from "lucide-react";

export function Header({ setIsSidebarOpen }) {
  const dispatch = useDispatch();
  const { handleLogout } = useAuth();
  const [dark, setDark] = useState(false);

  // Set dark mode based on localStorage value
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDark(true);
      document.body.classList.add("dark");
    } else {
      setDark(false);
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode and save to localStorage
  const darkModeHandler = () => {
    const newMode = !dark;
    setDark(newMode);
    document.body.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // Redux state for user
  const user = useSelector((state) => state.auth.user);

  // Dropdown state
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Fetch user profile and subscription info
  const {
    data: subscriptionInfo,
    isLoading: isProfileLoading,
    refetch: refetchUserProfile,
  } = useGetUserProfileQuery();

  // Logout handler
  const handleLogOut = () => {
    handleLogout();
    dispatch(userLoggedOut());
  };
  console.log("from header", user);
  return (
    <div className="w-full ml-auto">
      <header className="bg-[#1F1F1F] dark:bg-gray-700 dark:text-white text-black p-4 flex items-center justify-between z-0">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="mr-4 lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <Link to="/home" className="w-32 md:w-40 h-12">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-end gap-3 relative z-50">
            <div onClick={() =>setShowDropdown(!showDropdown)} className="cursor-pointer bg-[#D9D9D9] p-2 rounded-full">
              
              <MdOutlineSettings  />
            </div>
            <div ref={dropdownRef}>
              {showDropdown && (
                <div className="absolute top-10 right-0 mt-2 w-[300px] z-10 dark:bg-gray-700 dark:text-white bg-white rounded-xl shadow-xl p-4">
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-left px-4 py-2  transition-colors  "
                  >
                    <Link
                      // to={
                      //   subscriptionInfo?.subscription_status ===
                      //   "not_subscribed"
                      //     ? "/upgrade"
                      //     : "/manageSubscription"
                      // }
                      to={"/manageSubscription"}
                      className="flex items-center gap-2"
                    >
                      <CiSettings className="text-2xl" />
                      <p>Manage Subscription</p>
                    </Link>
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-left px-4 py-2  transition-colors  "
                  >
                    <Link
                      to="/helpAndSupport"
                      className="flex items-center gap-2"
                    >
                      <MdOutlineSupportAgent className="text-2xl" />
                      <p>Help & Support</p>
                    </Link>
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-left px-4 py-2  transition-colors  "
                  >
                    <Link
                      to="/TermsAndConditions"
                      className="flex items-center gap-2"
                    >
                      <TbChecklist className="text-2xl" />
                      <p>Terms & Conditions</p>
                    </Link>
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-left px-4 py-2  transition-colors  "
                  >
                    <Link
                      to="/privacyAndPolicy"
                      className="flex items-center gap-2"
                    >
                      <MdPrivacyTip className="text-2xl" />
                      <p>Privacy</p>
                    </Link>
                  </button>
                  {user && (
                    <button
                      onClick={handleLogOut}
                      className="bg-white dark:bg-transparent text-red-600 px-4 py-2 rounded hover:bg-indigo-100 mb-2 transition-colors flex items-center justify-center ml-1"
                    >
                      <LuLogOut className="text-2xl" />
                      <p className="ml-2">Logout</p>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
