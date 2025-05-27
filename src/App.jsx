"use client"

import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import { ChatProvider } from "./context/ChatContext"
import { Sidebar } from "./components/Sidebar"
import { ChatArea } from "./components/ChatArea"
import { Header } from "./components/Header"
import { Toaster } from "react-hot-toast"
import ModalForForgotPassword from "./components/Modals/ForgetPasswordModal"
import ModalForVerificationCode from "./components/Modals/VerificationCodeModal"
import ModalForResetPassword from "./components/Modals/ModalForResetPassword"
import Congratulations from "./components/Modals/Congratulation"
import ProfileModal from "./components/Modals/ModalForProfileEdit"
import { ModalForSettings } from "./components/Modals/SettingModal"
import { ModalForFAQ } from "./components/Modals/FaqModal"
import UpgradePage from "./components/UpgradeModal"
import { PrivateRoute } from "./components/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import ModalForSignUp from "./components/Modals/SingUpModal"
import ModalForLogin from "./components/Modals/LoginModal"
import ModalForAboutMe from "./components/Modals/AboutMe"
import SubscriptionDetails from "./components/Modals/ManageSuscription"
import VerifyForgetPasswordOtp from "./components/Modals/VerifyForgetPasswordOtp"
import { PublicRoute } from "./components/PublicRoute"
import NotFoundPage from "./pages/NotFoundPage.jsx"
import { HelpAndSupportPage } from "./components/Modals/HelpAndSupport"
import PrivacyPolicyPage from "./components/Modals/PrivacyAndPolicyModal"
import TermsAndConditionsPage from "./components/Modals/TermsAndCondtionModal"
import AppContent from "./page/Home/Home"

function MainContent() {
  const location = useLocation()
  // Sidebar state management - responsive behavior
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Default to closed on mobile

  // Define routes that should show header and sidebar
  const routesWithHeaderAndSidebar = [
    "/",
    "/chat/:id",
    "/calendar",
    "/chat-editor/:id",
    "/verificationCode",
    "/congratulations",
    "/editProfile",
    "/helpAndSupport",
    "/settings",
    "/faq",
    "/saved-chats",
    "/upgrade",
    "/manageSubscription",
    "/TermsAndConditions",
    "/aboutMe",
    "/privacyAndPolicy",
  ]

  // Check if current route should show header and sidebar
  const showHeaderAndSidebar = routesWithHeaderAndSidebar.some((route) => {
    const match = new RegExp("^" + route.replace(":id", "[^/]+") + "$")
    return match.test(location.pathname)
  })

  // Dynamic container class based on route
  const containerClass = location.pathname === "/home" ? "flex-1 flex flex-col" : "flex-1 flex flex-col h-screen"

  return (
    <div className={containerClass}>
      {/* Header - responsive design */}
      {showHeaderAndSidebar && <Header setIsSidebarOpen={setIsSidebarOpen} />}

      {/* Main content area with responsive layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - responsive behavior with overlay on mobile */}
        {showHeaderAndSidebar && (
          <>
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar component */}
            <div className="relative z-50">
              <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            </div>
          </>
        )}

        {/* Main content area - responsive margins */}
        <div
          className={`flex-1 flex flex-col bg-white dark:bg-gray-800 dark:text-white transition-all duration-300 ${
            showHeaderAndSidebar && isSidebarOpen
              ? "lg:ml-0" // No margin on large screens (sidebar is positioned)
              : ""
          }`}
        >
          <Routes>
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ChatArea />
                </PrivateRoute>
              }
            />

            {/* Home route - public access */}
            <Route path="/home" element={<AppContent />} />

            {/* Chat route with dynamic ID */}
            <Route
              path="/chat/:id"
              element={
                <PrivateRoute>
                  <ChatArea />
                </PrivateRoute>
              }
            />

            {/* Profile management */}
            <Route
              path="/editProfile"
              element={
                <PrivateRoute>
                  <ProfileModal />
                </PrivateRoute>
              }
            />

            {/* Authentication routes - public access only */}
            <Route
              path="/signUp"
              element={
                <PublicRoute>
                  <ModalForSignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <ModalForLogin />
                </PublicRoute>
              }
            />
            <Route
              path="/forgetPassword"
              element={
                <PublicRoute>
                  <ModalForForgotPassword />
                </PublicRoute>
              }
            />

            {/* Verification routes */}
            <Route path="/verificationCode" element={<ModalForVerificationCode />} />
            <Route
              path="/verifyForgetPasswordOtp"
              element={
                <PublicRoute>
                  <VerifyForgetPasswordOtp />
                </PublicRoute>
              }
            />
            <Route
              path="/resetPass"
              element={
                <PublicRoute>
                  <ModalForResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/congratulations"
              element={
                <PublicRoute>
                  <Congratulations />
                </PublicRoute>
              }
            />

            {/* Support and information pages */}
            <Route path="/helpAndSupport" element={<HelpAndSupportPage />} />
            <Route path="/settings" element={<ModalForSettings />} />
            <Route path="/faq" element={<ModalForFAQ />} />

            {/* Subscription management - protected routes */}
            <Route
              path="/upgrade"
              element={
                <PrivateRoute>
                  <UpgradePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/manageSubscription"
              element={
                <PrivateRoute>
                  <SubscriptionDetails />
                </PrivateRoute>
              }
            />

            {/* Legal pages */}
            <Route path="/TermsAndConditions" element={<TermsAndConditionsPage />} />
            <Route path="/terms" element={<TermsAndConditionsPage />} />
            <Route path="/aboutMe" element={<ModalForAboutMe />} />
            <Route path="/privacyAndPolicy" element={<PrivacyPolicyPage />} />

            {/* 404 fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      {/* Authentication context provider */}
      <AuthProvider>
        {/* Chat context provider */}
        <ChatProvider>
          {/* Main app container with responsive font */}
          <div className="flex font-montserrat min-h-screen">
            <MainContent />
          </div>
          {/* Toast notifications */}
          <Toaster />
        </ChatProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
