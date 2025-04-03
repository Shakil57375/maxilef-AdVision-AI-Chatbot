import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Get user authentication state from Redux or localStorage
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user?.id; // Check if user is logged in

  // Handle redirection based on authentication state
  const handleRedirect = () => {
    if (isLoggedIn) {
      navigate("/"); // Redirect to dashboard if logged in
    } else {
      navigate("/home"); // Redirect to home if not logged in
    }
  };

  return (
    <div className="relative bg-[#5C1CA8] text-white flex flex-col items-center justify-center h-screen">
      {/* Content */}
      <div className="text-center px-6 md:px-8 relative z-10">
        <h1 className="text-6xl font-extrabold mb-6 text-red-500">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </h2>
        <p className="text-lg mb-8 text-gray-200">
          It looks like you took a wrong turn or the page has been moved. Don’t
          worry, we’ll guide you back!
        </p>
        <button
          onClick={handleRedirect}
          className="bg-[#CC7FFF] text-white px-12 py-3 rounded-full font-semibold shadow-lg hover:bg-[#a75ed9] transition duration-300"
        >
          {isLoggedIn ? "Go Back to Dashboard" : "Go Back to Home"}
        </button>
      </div>

      {/* Decorative Gradient Circles */}
      <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-pink-500 opacity-20 rounded-full blur-3xl bottom-20 md:bottom-32 right-[150px]"></div>
      <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-pink-500 opacity-20 rounded-full blur-3xl top-20 -left-20"></div>
      <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-pink-500 opacity-20 rounded-full blur-3xl -top-10 -right-20"></div>
    </div>
  );
};

export default NotFoundPage;
